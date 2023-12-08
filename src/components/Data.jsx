import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import Count from "./Count.jsx";
import { Link } from "react-router-dom";
import { ref, deleteObject, listAll, getDownloadURL } from "firebase/storage";
export default function Data() {
  const [tableData, setTableData] = useState(null);
  const [imageList, setImageList] = useState([]);
  const [resumeList, setresumeList] = useState([]);
  const [model, setModel] = useState(false);
  const [count, setCount] = useState(0);
  const [search, setSearch] = useState("");
  //Getting image
  const imageListRef = ref(storage, "image/");
  useEffect(() => {
    const imageFatch = async () => {
      try {
        const response = await listAll(imageListRef);
        const promises = response.items.map((item) => getDownloadURL(item));
        const urls = await Promise.all(promises);
        setImageList(urls);
      } catch (error) {
        console.error("Error fetching imageLisT:", error);
      }
    };
    imageFatch();
  }, []);

  // getting resume
  const resumeListRef = ref(storage, "resume/");
  useEffect(() => {
    const fetchRData = async () => {
      try {
        const response = await listAll(resumeListRef);
        const promises = response.items.map((item) => getDownloadURL(item));
        const urls = await Promise.all(promises);
        setresumeList(urls);
      } catch (error) {
        console.error("Error fetching resumeList:", error);
      }
    };

    fetchRData();
  }, []);

  async function fetchData() {
    const collectionRef = collection(db, "data");
    const querySnapshot = await getDocs(collectionRef);

    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });
    setTableData(data);
    setCount(data.length);
  }
  useEffect(() => {
    fetchData();
  }, []);

  // delete
  async function handleDelete(personId) {
    try {
      const personRef = doc(db, "data", personId);
      await deleteDoc(personRef);
      console.log("Person data deleted successfully");
    } catch (error) {
      console.error("Error deleting person data:", error);
      return;
    }
    try {
      const imageName = `${personId}`;
      const imageRef = ref(storage, `image/${imageName}`);
      await deleteObject(imageRef);
      console.log("Image deleted successfully");
    } catch (error) {
      console.error("Error deleting image:", error);
      return;
    }
    try {
      const resumeName = `${personId}`;
      const resumeRef = ref(storage, `resume/${resumeName}`);
      await deleteObject(resumeRef);
      console.log("Resume  deleted successfully");
    } catch (error) {
      console.error("Error deleting resume:", error);
      return;
    }
    fetchData();
  }
  // search
  const searchData = (e) => {
    e.preventDefault();
    setTableData(
      tableData.filter((dat) =>
        dat.firstname.toLowerCase().includes(search.toLowerCase())
      )
    );
  };

  return (
    <>
      <form onSubmit={(e) => searchData(e)}>
        <input
          type="text"
          onChange={(e) => {
            setSearch(e.target.value);
          }}
        />
        <button type="submit">search</button>
        <Count data={count} />
      </form>
      <div className="tabel-div">
        <table>
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Data of B</th>
              <th>Email</th>
              <th>Phone No</th>
              <th>Qualification</th>
              <th>Image</th>
              <th>resume</th>
              <th>Edit</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row) => (
              <tr key={row.id}>
                <td>{row.firstname}</td>
                <td>{row.lastname}</td>
                <td>{row.address}</td>
                <td>{row.dataofb}</td>
                <td>{row.email}</td>
                <td>{row.phoneNo}</td>
                <td>{row.Qualification}</td>
                <td>
                  {imageList.map((url, index) => {
                    const imageName = `${row.id}`;
                    if (url.includes(imageName)) {
                      return (
                        <img
                          key={index}
                          className="displayimage"
                          src={url}
                          alt={`${row.id}`}
                        />
                      );
                    }
                    return null;
                  })}
                </td>

                <td>
                  {resumeList.map((url, index) => {
                    const resumeName = `${row.id}`;
                    if (url.includes(resumeName)) {
                      return (
                        <React.Fragment key={index}>
                          <button onClick={() => setModel((prev) => !prev)}>
                            download
                          </button>
                          {model === true && row.id === resumeName && (
                            <embed
                              type="application/pdf"
                              key={index}
                              src={url}
                              className="pdf"
                            />
                          )}
                        </React.Fragment>
                      );
                    }
                    return null;
                  })}
                </td>
                <td>
                  <Link to={`/${row.id}`}>Edit</Link>
                </td>
                <td>
                  <button onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
