import { React, useState, useEffect } from "react";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { nanoid } from "nanoid";
import { db, storage } from "../firebase/firebase";
import readData from "../firebase/readData";
import { ref, uploadBytes, listAll } from "firebase/storage";
import { useParams, Link } from "react-router-dom";
import Qualification from "./Qual.jsx";
export default function Form() {
  const params = useParams();
  const [resume, setresume] = useState(null);
  const [image, setImage] = useState(null);
  const [imgurl, setImgurl] = useState();
  const [resumeurl, setResumeurl] = useState();
  const [id, setId] = useState(params.Form !== "Form" ? params.Form : nanoid());
  const [qualification, setQualification] = useState([]);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    address: "",
    phoneNo: "",
    dataofb: "",
    email: "",
    Qualification: "",
  });
  // dumping data in firebase
  useEffect(() => {
    async function fetchData() {
      const [record, imageurl, resumeurl] = await readData(id);
      if (record !== null) {
        setData({
          firstname: record.firstname || "",
          lastname: record.lastname || "",
          address: record.address || "",
          email: record.email || "",
          address: record.address || "",
          phoneNo: record.phoneNo || "",
          dataofb: record.dataofb || "",
        });
        setQualification(record.Qualification || []);
        setImgurl(imageurl || null);
        setResumeurl(resumeurl || null);
      }
    }
    if (id) {
      fetchData();
    }
  }, [id]);
  async function dumpData() {
    try {
      const docRef = doc(db, "data", id);
      await setDoc(docRef, {
        ...data,
        Qualification: qualification,
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
    setResumeurl(URL.createObjectURL(event.target.files[0]));
  }

  // save image
  function sameImage(event) {
    setImage(event.target.files[0]);
    setImgurl(URL.createObjectURL(event.target.files[0]));
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
    }));
    setQualification([]);
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
          accept=".jpg,.png,.jpeg,.jfif"
        />
        <img src={imgurl} className=" inputimage" />

        <label htmlFor="imageInput" className="custom-file-upload">
          Choose Image
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
          value={data.firstname || ""}
          required
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
          value={data.lastname || ""}
          required
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
          value={data.address || ""}
          required
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
          value={data.dataofb || ""}
          required
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
          value={data.phoneNo || ""}
          required
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
          value={data.email || ""}
          required
        />
      </div>
      <div>
        <Qualification
          qualification={qualification}
          setQualification={setQualification}
        />
      </div>
      <input
        className="resume"
        type="file"
        name="resume"
        id="resumebox"
        onChange={sameresume}
        accept=".pdf"
        required
      />

      <label htmlFor="resumebox" className="custom-file-upload">
        resume
      </label>
      <Link target="_blank" to={resumeurl}>
        reuma
      </Link>
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
