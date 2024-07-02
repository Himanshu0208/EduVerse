import 'react-quill/dist/quill.snow.css';

import {getDownloadURL,getStorage, ref, uploadBytesResumable} from "firebase/storage";
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import ReactQuill from "react-quill";
import {useSelector} from "react-redux";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { app } from '../../Helpers/firebase';
import HomeLayout from '../../Layouts/HomeLayout';
import { createCourse } from '../../Redux/courseSlices';

export default function CreateCourse() {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const data = useSelector((state) => JSON.parse(state.user.data));

  // video uploading
  const [video, setVideo] = useState(null);
  const [videoUploadProgress, setVideoUploadProgress] = useState(null);
  const [videoUploadError, setVideoUploadError] = useState(null);

  // image uploading
  const [image, setImage] = useState(null);
  const [imageUploadProgress, setImageUploadProgress] = useState(null);
  const [imageUploadError, setImageUploadError] = useState(null);

  const [courseData, setCourseData] = useState({
    email: data.email,
    title: '',
    overview: '',
    description: '',
    thumbnail: '',
    introVideo: '',
    preRequisites: [''],
    learning: ['']
  })

  const handelVideoUpload = async () => {
    try {
      console.log('video upload');
      if(!video) {
        setVideoUploadError("Please select a video");
        return;
      }
  
      const storage = getStorage(app);
      const fileName = data.email + '-video-' + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTaskVideo = uploadBytesResumable(storageRef, video);
      uploadTaskVideo.on(
        'state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setVideoUploadProgress(progress.toFixed(0))
        }, 
        (error) => {
          setVideoUploadError(`Video Upload Failed ${error}`);
          setVideoUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTaskVideo.snapshot.ref).then((downloadURL) => {
            setVideoUploadProgress(null);
            setVideoUploadError(null);
            setCourseData((prev) => ({...prev, introVideo: downloadURL}));
            // setVideoURL(downloadURL);
          })
        }
      );
    } catch (error) {
      setVideoUploadError(error.message);
      setVideoUploadProgress(null);
      console.log(error.message);
    }
  }

  const handelImageUpload = async () => {
    try {
      console.log('image upload');
      if(!video) {
        setImageUploadError("Please select Image");
        return;
      }
  
      const storage = getStorage(app);
      const fileName = data.email + '-image-' + new Date().getTime();
      const storageRef = ref(storage, fileName);
      const uploadTaskImage = uploadBytesResumable(storageRef, image);
      uploadTaskImage.on(
        'state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progress.toFixed(0))
        }, 
        (error) => {
          setImageUploadError(`Image Upload Failed ${error}`);
          setImageUploadProgress(null);
        },
        () => {
          getDownloadURL(uploadTaskImage.snapshot.ref).then((downloadURL) => {
            setImageUploadProgress(null);
            setImageUploadError(null);
            setCourseData((prev) => ({...prev, thumbnail: downloadURL}))
            // setImageURL(downloadURL);
          })
        }
      );
    } catch (error) {
      setImageUploadError(error.message);
      setImageUploadProgress(null);
      console.log(error.message);
    }
  }

  const handleAddMore = (event) => {
    const {name} = event.target;
    console.log(name, courseData[name]);
    setCourseData((prev) => ({...prev, [name]: [...prev[name], '']}));
  };

  const handleChange = (key, event, index) => {
    const updatedArr = courseData[key];
    updatedArr[index] = event.target.value;
    setCourseData((prev) => ({...prev , [key] :updatedArr}));
  };

  const handleDelete = (e, index) => {
    const {name} = e.target;
    console.log(name, courseData[name]);
    console.log(index);
    setCourseData((prev) => ({...prev, [name]:prev[name].filter((item, idx) => idx !== index)}));
  };

  const handelInputChange = (e) => {
    const {name, value} = e.target;
    setCourseData((prev) => ({...prev, [name]: value}))
  }

  const handelSubmit = async (event) => {
    event.preventDefault();

    console.log('course data ->', courseData );

    if(courseData.preRequisites.some((str) => str.trim() === '')) {
      toast.error("any pre requists can't be empty");
      return;
    }

    if(courseData.learning.some((str) => str.trim() === '') || courseData.learning.length === 0) {
      toast.error("any learning can't be empty and one learning is necessary")
      return;
    }

    if(courseData.description === '') {
      toast.error("course description is required");
      return;
    }

    if(courseData.overview === '') {
      toast.error("course overview is required");
      return;
    }

    if(courseData.title === '') {
      toast.error("course title is nessacry");
      return;
    }

    if(courseData.imageURL === '') {
      toast.error("upload a thumbnail");
      return;
    }
    
    if(courseData.videoURL === '') {
      toast.error("upload a introductory video");
      return;
    }
    


    console.log('course data -> ', courseData);
    const res = await dispatch(createCourse(courseData));

    if (res?.payload?.success) {
      setCourseData({
        title: '',
        overview: '',
        description: '',
        thumbnail: '',
        introVideo: '',
        preRequisites: [''],
        learning: ['']
      });

      // redirecting the user to admin dashboard
      navigate("/admin/dashboard");
    }
    return;
  }

  return (
    <HomeLayout> 
      <div className='px-10 py-5'>
      <h1 className='text-yellow-500 text-center text-4xl font-bold'>Enter Your Course Details</h1>

      <form onSubmit={handelSubmit} method="post" className='flex flex-col gap-5 justify-center items-center'>
        {/* course overview */}
        <fieldset className='border border-yellow-300 rounded-md p-5 w-10/12'>
          <legend className='text-white font-semibold text-2xl'>Course overview</legend>
          <div className='flex justify-between mb-5'>

            {/* title */}
            <label className="form-control w-full max-w-xs">
              <div className="label">
                <span className="label-text font-medium text-md text-white">Title</span>
              </div>
              <input type="text" placeholder="Title..." className="input input-bordered w-full max-w-xs bg-white text-gray-600 input-sm" name='title' value={courseData.title} onChange={handelInputChange} />
            </label>

            {/* video upload */}
            <label className="form-control w-[15rem]">
              <div className="label">
                <span className="label-text font-medium text-md text-white w-[15rem]">Upload Introduction Video</span>
              </div>
              <input type="file" name='video' id='video' className="file-input file-input-bordered file-input-yellow file-input-sm w-full max-w-[15rem] bg-white" accept='.mp4' onChange={(e) => setVideo(e.target.files[0])}/>
              <button 
                type="button" 
                className='btn-primary py-1 mt-2 rounded-md' 
                onClick={handelVideoUpload}
              >
                {videoUploadProgress ? (
                  <div className='flex justify-center gap-3'>
                    <div className="radial-progress " style={{ "--value": videoUploadProgress, "--size": "1.5rem", "--thickness": "3px" }} role="progressbar">
                    </div>
                    <p>{`${videoUploadProgress || 0}% uploaded`}</p>
                  </div>
                ) : (
                  'Upload'
                )}
              </button>
              <span className='font-semibold text-red-400 text-lg'>{videoUploadError}</span>
            </label>
            
            {/* thumbnail upload */}
            <label className="form-control w-[15rem]">
              <div className="label">
                <span className="label-text font-medium text-md text-white">Upload Thumbnail</span>
              </div>
              <input type="file" name='video' id='video' className="file-input file-input-bordered file-input-yellow file-input-sm w-full max-w-[15rem] bg-white" accept='.jpg,.jpeg,.png' onChange={(e) => setImage(e.target.files[0])}/>
              <button 
                type="button" 
                className='btn-primary py-1 mt-2 rounded-md' 
                onClick={handelImageUpload}
              >
                {imageUploadProgress ? (
                  <div className='flex justify-center gap-3'>
                    <div className="radial-progress " style={{ "--value": imageUploadProgress, "--size": "1.5rem", "--thickness": "3px" }} role="progressbar">
                    </div>
                    <p>{`${imageUploadProgress || 0}% uploaded`}</p>
                  </div>
                ) : (
                  'Upload'
                )}
              </button>
              <span className='font-semibold text-red-400 text-lg'>{imageUploadError}</span>
            </label>
          </div>
          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='bg-white'
            required
            onChange={(value) => setCourseData({...courseData, overview: value})}
          />
        </fieldset>

        {/* course description */}
        <fieldset className='border border-yellow-300 rounded-md p-5 w-10/12'>
          <legend className='text-white font-semibold text-2xl '>Course description</legend>
          <ReactQuill
            theme='snow'
            placeholder='Write something...'
            className='bg-white'
            required
            onChange={(value) => setCourseData({...courseData, description: value})}
          />
        </fieldset>

        {/* pre requists */}
        <fieldset className='border border-yellow-300 rounded-md p-5 w-10/12'>
          <legend className='text-white font-semibold text-2xl'>Pre requisites</legend>
          {courseData.preRequisites.map((preReq, index) => (
            <div key={index}>
              <input
                type="text"
                name={`pre-requists-${index}`}
                id={`pre-requists-${index}`}
                value={preReq}
                onChange={(event) => handleChange('preRequisites', event, index)}
                className='bg-white px-2 py-1 text-gray-800 mb-2 w-10/12'
              />
              <button
                type="button"
                name='preRequisites'
                onClick={(e) => handleDelete(e, index)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" 
            name='preRequisites'
            onClick={handleAddMore} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add More
          </button>
        </fieldset>

        {/* what you will learn */}
        <fieldset className='border border-yellow-300 rounded-md p-5 w-10/12'>
          <legend className='text-white font-semibold text-2xl'>What students will learn</legend>
          {courseData.learning.map((what, index) => (
            <div key={index}>
              <input
                type="text"
                name={`what-${index}`}
                id={`what-${index}`}
                value={what}
                onChange={(event) => handleChange('learning' , event, index)}
                className='bg-white px-2 py-1 text-gray-800 mb-2 w-10/12'
              />
              <button
                type="button"
                name='learning'
                onClick={(event) => handleDelete(event, index)}
                className="ml-2 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          ))}
          <button type="button" 
            name='learning'
            onClick={(event) => handleAddMore(event)} 
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add More
          </button>
        </fieldset>

        <div className='flex gap-10'>
          <button type="submit" className='px-10 py-2 btn-primary border rounded-lg'>Submit</button>
          <button type="reset" className='px-10 py-2 btn-secondary border rounded-lg'>Reset</button>
        </div>
      </form>
      </div>
    </HomeLayout>
  );
}