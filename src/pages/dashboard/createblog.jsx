import { FaCirclePlus } from "react-icons/fa6";
import  { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import instance from '../../config/axios.config';
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  adminBtnPrimary,
  adminCardBody,
  adminFieldLabel,
  adminInput,
  adminSectionDesc,
  adminSectionHead,
  adminSectionTitle,
} from "../../utils/adminUi";

const Create = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUploadsBase = `${instance.defaults.baseURL}/uploads/images`;

  const state = location.state || {};
  const postid = state.postid;

  const [content, setContent] = useState(state?.content || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(state?.cover || "");
  const [shares, setShares] = useState(state?.shares || 0);

  // ✅ WORKING UPLOAD FUNCTION
  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await instance.post("/upload/images", formData);
      return res.data; // returns filename like "1747454546-image.jpg"
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploaded = file ? await upload() : null;

    const cover = uploaded
      ? `${backendUploadsBase}/${uploaded}`
      : existingImage;

    try {
      if (postid) {
        await instance.put(`/posts/${postid}`, {
          title,
          content,
          shares,
          cover,
        });
      } else {
        await instance.post(`/posts`, {
          title,
          content,
          shares,
          cover,
        });
      }

      toast.success('Blog created successfully!');
      navigate("/blogs");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Unable to create blog. Please try again.');
      }
    }
  };

  return (
    <section className="brand-card overflow-hidden">
      <div className={adminSectionHead}>
        <h1 className={adminSectionTitle}>Create new blog</h1>
        <p className={adminSectionDesc}>Write and publish a new article to the Lasglowtech blog.</p>
      </div>
      <div className={`${adminCardBody} space-y-4`}>
        <input
          type="text"
          className={adminInput}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="rounded-xl border border-slate-200 overflow-hidden bg-white [&_.ql-container]:min-h-[220px] [&_.ql-editor]:min-h-[200px] [&_.ql-editor]:text-slate-800">
          <ReactQuill theme="snow" value={content} onChange={setContent} />
        </div>

        <div>
          <label className={adminFieldLabel}>Cover image</label>
          <input type="file" id="file" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
          <div className="flex flex-wrap items-center gap-3">
            <label htmlFor="file" className="inline-flex items-center gap-2 cursor-pointer text-[#8700ff] font-medium text-sm">
              <FaCirclePlus className="text-2xl" />
              Upload cover
            </label>
            <button type="button" className={adminBtnPrimary} onClick={handleSubmit}>
              Publish
            </button>
          </div>
          {existingImage && !file && (
            <img
              src={existingImage.startsWith("http") ? existingImage : `${backendUploadsBase}/${existingImage}`}
              alt="Current post"
              className="mt-4 w-full max-h-64 object-cover rounded-xl border border-slate-200"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Create;

