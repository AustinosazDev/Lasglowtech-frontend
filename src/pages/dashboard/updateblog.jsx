import { FaCirclePlus } from "react-icons/fa6";
import React, { useState } from 'react';
import RichTextEditor from "../../components/blog/RichTextEditor";

import instance from '../../config/axios.config';
import { getAdminToken } from "../../utils/adminAuth";
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

const Update = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const backendUploadsBase = `${instance.defaults.baseURL}/uploads/images`;

  const state = location.state || {};
  const postid = state.postid;

  const [content, setContent] = useState(state?.content || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [existingImage, setExistingImage] = useState(state?.thumbnail || state?.thumbnailUrl || state?.cover || "");
  const [excerpt, setExcerpt] = useState(state?.excerpt || "");
  const [category, setCategory] = useState(state?.category || "Company News");
  const [status, setStatus] = useState(state?.status || "draft");
  const categories = ["Design", "Web & Mobile Development", "Latest Tech Trends", "Branding & Marketing", "Business & Startups", "Case Studies", "Company News"];

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await instance.post("/upload/images", formData);
      return res.data; // Image URL
    } catch (error) {
      console.error("Upload Error:", error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const uploaded = file ? await upload() : null;
    const thumbnail = uploaded || existingImage;

    try {
      if (postid) {
        await instance.put(`/blog/${postid}`, {
          title,
          content,
          excerpt,
          category,
          status,
          thumbnail,
        }, { headers: { Authorization: `Bearer ${getAdminToken()}` } });
        toast.success('Blog updated successfully!');
      } else {
        await instance.post(`/blog`, {
          title,
          content,
          excerpt,
          category,
          status,
          thumbnail,
        }, { headers: { Authorization: `Bearer ${getAdminToken()}` } });
        toast.success('Blog created successfully!');
      }
      navigate("/dashboard/bloglist");
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error(error.response.data.error);
      } else {
        toast.error('Unable to submit blog. Please try again.');
      }
    }
  };

  return (
    <section className="brand-card overflow-hidden">
      <div className={adminSectionHead}>
        <h1 className={adminSectionTitle}>{postid ? "Update blog" : "Create new blog"}</h1>
        <p className={adminSectionDesc}>Edit article content, cover image, and publish changes.</p>
      </div>
      <div className={`${adminCardBody} space-y-4`}>
        <input
          type="text"
          className={adminInput}
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <div><label className={adminFieldLabel}>Category</label><select className={adminInput} value={category} onChange={(e) => setCategory(e.target.value)}>{categories.map((item) => <option key={item} value={item}>{item}</option>)}</select></div>
          <div><label className={adminFieldLabel}>Status</label><select className={adminInput} value={status} onChange={(e) => setStatus(e.target.value)}><option value="draft">Save as draft</option><option value="published">Publish now</option></select></div>
        </div>

        <div><label className={adminFieldLabel}>Excerpt <span className="text-slate-400">({excerpt.length}/200)</span></label><textarea className={adminInput} rows="3" maxLength="200" value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="Short summary for blog cards and search previews" /></div>

        <div><label className={adminFieldLabel}>Content</label><RichTextEditor value={content} onChange={setContent} /></div>

        <div>
          <label className={adminFieldLabel}>Cover image</label>
          <input
            type="file"
            id="file"
            className="hidden"
            onChange={(e) => {
              const selectedFile = e.target.files[0];
              setFile(selectedFile);
              if (selectedFile) setExistingImage(URL.createObjectURL(selectedFile));
            }}
          />
          <label htmlFor="file" className="inline-flex items-center gap-2 cursor-pointer text-[#8700ff] font-medium text-sm">
            <FaCirclePlus className="text-2xl" />
            Upload cover
          </label>
          {existingImage && (
            <img src={existingImage} alt="Post cover" className="mt-4 w-full max-h-64 object-cover rounded-xl border border-slate-200" />
          )}
        </div>

        <button type="button" className={adminBtnPrimary} onClick={handleSubmit}>
          {status === "published" ? "Publish changes" : "Save draft"}
        </button>
      </div>
    </section>
  );
};

export default Update;

