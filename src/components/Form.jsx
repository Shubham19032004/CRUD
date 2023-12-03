import { React, useState, useEffect } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db, storage } from "../firebase/firebase";
import readData from "../firebase/readData";
import { ref, uploadBytes, listAll } from "firebase/storage";

export default function Form(props) {
  const [isVisible, setIsVisible] = useState(false);
  const [resume, setresume] = useState(null);
  const [image, setImage] = useState(null);
  const [id, setId] = useState(props.id || nanoid());
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phoneNo: null,
    dataofb: "",
    email: "",
    qualification: "",
    id: null,
  });
  // dumping data in firebase
  useEffect(() => {
    async function fetchData() {
      const record = await readData(id);
      if (record !== null) {
        setData({
          firstname: record.firstname || "",
          lastname: record.lastname || "",
          address: record.address || 0,
          email: record.email || "",
          address: record.address || "",
          phoneNo: record.phoneNo || "",
          dataofb: record.dataofb || "",
          qualification: record.qualification || "",
          id: record.id || "",
        });
        setImage(record.image || null);
        setresume(record.resume || null);
      }
    }
    fetchData();
  }, [id]);
  async function dumpData() {
    try {
      const docRef = doc(db, "data", id);
      await setDoc(docRef, {
        ...data,
        id: id,
      });

      uploadimg(id);
      uploadresume(id);
      alert("Successfully stored data in Firestore");
    } catch (error) {
      console.log(error);
    }
    handleDelete();
  }
  // upload the image

  async function uploadimg(getid) {
    if (image == null) return;

    const imageRef = ref(storage, `image/${getid}`);

    uploadBytes(imageRef, image);
  }
  async function uploadresume(getid) {
    if (resume == null) return;
    const resumeRef = ref(storage, `resume/${getid}`);
    uploadBytes(resumeRef, resume);
    const resumeList = await listAll(resumeRef.parent);
  }

  // saving value in setData
  async function handleChange(event) {
    const { name, value, type } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "file" ? event.target.files[0] : value,
    }));
  }
  //save resume
  function sameresume(event) {
    setresume(event.target.files[0]);
  }

  // save image
  function sameImage(event) {
    setImage(event.target.files[0]);
  }
  // delete data
  function handleDelete() {
    setData((prev) => ({
      firstname: "",
      lastname: "",
      address: "",
      dataofb: "",
      phoneNo: "",
      email: "",
      qualification: "",
      id: null,
    }));
  }
  return (
    <div className="Form">
      <div className="image">
        <input
          className="input-form-image"
          type="file"
          name="image"
          id="imageInput"
          onChange={sameImage}
        />

        <label htmlFor="imageInput" className="custom-file-upload">
          <i className="fa fa-cloud-upload"></i> Choose Image
        </label>
      </div>
      <div className="formContent">
        <label htmlFor="firstname" className="label">
          FirstName:
        </label>
        <input
          className="input-form"
          type="text"
          placeholder="first-name"
          name="firstname"
          onChange={handleChange}
          value={data.firstname}
        />
      </div>
      <div className="formContent">
        <label htmlFor="lastname" className="label">
          lastname:
        </label>
        <input
          className="input-form"
          type="text"
          placeholder="last-name"
          name="lastname"
          onChange={handleChange}
          value={data.lastname}
        />
      </div>
      <div className="formContent">
        <label htmlFor="address" className="label">
          Address:
        </label>
        <input
          className="input-form"
          type="text"
          placeholder="address-name"
          name="address"
          onChange={handleChange}
          value={data.address}
        />
      </div>
      <div className="formContent">
        <label htmlFor="dataofb" className="label">
          DOB:
        </label>
        <input
          className="input-form"
          type="date"
          name="dataofb"
          onChange={handleChange}
          value={data.dataofb}
        />
      </div>
      <div className="formContent">
        <label htmlFor="phoneNo" className="label">
          Phone-NO:
        </label>
        <input
          className="input-form"
          type="number"
          placeholder="Phone-No"
          name="phoneNo"
          onChange={handleChange}
          value={data.phoneNo}
        />
      </div>
      <div className="formContent">
        <label htmlFor="email" className="label">
          Email:
        </label>
        <input
          className="input-form"
          type="email"
          placeholder="Email"
          name="email"
          onChange={handleChange}
          value={data.email}
        />
      </div>
      <div>
        <button
          className="addButton"
          onClick={() => setIsVisible((prev) => !prev)}
        >
          {isVisible ? "-" : "+"}
        </button>
        {isVisible && (
          <textarea
            className="input-form"
            type="text"
            placeholder="qualification"
            name="qualification"
            onChange={handleChange}
          />
        )}
      </div>
      <input
        className="resume"
        type="file"
        name="resume"
        id="resumebox"
        onChange={sameresume}
      />

      <label htmlFor="resumebox" className="custom-file-upload">
        resume
      </label>
      <div>
        <button className="form-button" onClick={dumpData}>
          Submit
        </button>
        <button className="form-button" type="reset" onClick={handleDelete}>
          Delete
        </button>
      </div>
    </div>
  );
}
