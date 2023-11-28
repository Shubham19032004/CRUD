import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db, storage } from "../firebase/firebase";
import {
  ref,
  uploadBytes,
  deleteObject,
  listAll,
  getDownloadURL,
} from "firebase/storage";
export default function Form() {
  const [tableData, setTableData] = useState([]);
  const [imageList, setImageList] = useState([]);
  const [resumaList, setResumaList] = useState([]);
  const [isedit, setIsEdit] = useState(false);
  const [model, setModel] = useState(false);
  const [editid, setEditid] = useState("");
  const [newData, setNewData] = useState("");
  const [field, setField] = useState("");

  const [search, setSearch] = useState("");
  //Getting image
  const imageListRef = ref(storage, "image/");
  useEffect(() => {
    listAll(imageListRef)
      .then((response) => {
        const promises = response.items.map((item) => getDownloadURL(item));
        return Promise.all(promises);
      })
      .then((urls) => {
        setImageList(urls);
        console.log(1);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);
  // getting resuma
  const resumaListRef = ref(storage, "resuma/");
  useEffect(() => {
    listAll(resumaListRef)
      .then((response) => {
        const promises = response.items.map((item) => getDownloadURL(item));
        return Promise.all(promises);
      })
      .then((urls) => {
        setResumaList(urls);
        console.log(1);
      })
      .catch((error) => {
        console.error("Error fetching images:", error);
      });
  }, []);
  useEffect(() => {
    // Fetch data when the component mounts
    fetchData();
  }, []);
  // Fetch data
  async function fetchData() {
    const collectionRef = collection(db, "data");
    const querySnapshot = await getDocs(collectionRef);

    const data = [];
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() });
    });

    setTableData(data);
  }

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
      return;
    }
    fetchData();
  }

  // edit
  // Edit
  const handleEdit = async () => {
    try {
      const personRef = doc(db, "data", editid);
      await updateDoc(personRef, { [field]: newData });
      console.log("Data updated successfully!");
      setIsEdit(false);
    } catch (error) {
      console.error("Error updating data:", error);
    }
  };
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
      </form>
      <div className="tabel-div">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Address</th>
              <th>Data of B</th>
              <th>Email</th>

              <th>Phone No</th>
              <th>Qualification</th>
              <th>Image</th>
              <th>Resuma</th>
              <th>Edit</th>
              <th>delete</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.firstname}</td>
                <td>{row.lastname}</td>
                <td>{row.address}</td>
                <td>{row.dataofb}</td>
                <td>{row.email}</td>
                <td>{row.phoneNo}</td>
                <td>{row.qualification}</td>
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
                  <td>
                    {resumaList.map((url, index) => {
                      const resumaName = `${row.id}`;
                      if (url.includes(resumaName)) {
                        return (
                          <>
                            <button
                              key={index}
                              src={url}
                              alt={`${row.id}`}
                              onClick={() => setModel((prev) => !prev)}
                            >
                              download
                            </button>
                            {model === true && row.id === resumaName && (
                              <embed
                                type="application/pdf"
                                key={index}
                                src={url}
                                className="pdf"
                              />
                            )}
                          </>
                        );
                      }
                      return null;
                    })}
                  </td>
                </td>
                <td>
                  <button
                    onClick={() => {
                      setIsEdit(true);
                      setEditid(row.id);
                    }}
                  >
                    Edit
                  </button>
                </td>
                <td>
                  <button onClick={() => handleDelete(row.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
       
      </div>
      {isedit != false && (
          <div>
            <span>Field:</span>
            <input type="text" value={field} onChange={(e)=>{setField(e.target.value);}} />
            <label>New Data: </label>
            <input type="text" value={newData} onChange={(e)=>handleInputChange(e.target.value)} />
            <button onClick={handleEdit}>Edit Data</button>
          </div>
        )}
    </>
  );
}
