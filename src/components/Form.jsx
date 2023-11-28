import { React, useState, Component, useEffect } from "react";
import { doc, setDoc, addDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db, storage } from "../firebase/firebase";

import { ref, uploadBytes } from "firebase/storage";
export default function Form() {
  const [isVisible, setIsVisible] = useState(false);
  const [resuma, setResuma] = useState(null);
  const [image, setImage] = useState(null);

  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phoneNo: "",
    dataofb: "",
    email: "",
    qualification: "",
    id: null,
  });
  // dumping data in firebase
  async function dumpData() {
    const id = nanoid();
    console.log(id);
    try {
      // setData((prevData) => ({
      //   ...prevData,
      //   id:id,
      // }));

      const docRef = doc(db, "data", id);

      await setDoc(docRef, data);
      await setDoc(docRef, {
        ...data,
        id: id,
      });
      uploadimg(id);
      uploadResuma(id);
      console.log("Successfully stored data in Firestore");
    } catch (error) {
      console.log(error);
    }
    handleDelete()
  }
  // upload the image
  function uploadimg(getid) {
    if (image == null) return;
    const imageRef = ref(storage, `image/${getid}`);
    uploadBytes(imageRef, image).then(() => {
      console.log("image uploded");
    });
  }
  function uploadResuma(getid) {
    if (resuma == null) return;
    const resumaRef = ref(storage, `resuma/${getid}`);
    uploadBytes(resumaRef, resuma).then(() => {
      console.log("resuma uploded");
    });
  }
  // saving value in setData
  function handleChange(event) {
    const { name, value, type } = event.target;
    setData((prev) => ({
      ...prev,
      [name]: type === "file" ? event.target.files[0] : value,
    }));

    console.log(data);
  }
  //save resuma
  function sameResuma(event) {
    setResuma(event.target.files[0]);
  }

  // save image
  function sameImage(event) {
    setImage(event.target.files[0]);
  }
  // delete data
  function handleDelete() {
    setData((prev) => ({
      image: null,
      firstname: "",
      lastname: "",
      address: "",
      phoneNo: "",
      email: "",
      qualification: "",
      resume: null,
      id: null,
    }));
    console.log(data);
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
        className="resuma"
        type="file"
        name="resuma"
        id="resumabox"
        onChange={sameResuma}
      />

      <label htmlFor="resumabox" className="custom-file-upload">
        resuma
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
