import { useForm } from "react-hook-form";
import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import "./EmailForm.css";

export const EmailForm = () => {
  // register: input'u forma kaydeder, setValue: input'a değer atar, watch: değerleri izler
  const { register, setValue, watch } = useForm();
  // Dropdown menülerin açık/kapalı durumlarını tutan state
  const [dropdowns, setDropdowns] = useState({
    whom: false,
    cc: false,
    bcc: false,
  });
  // Kullanıcının kendi girdiği e-posta adreslerini tutar
  const [customEmails, setCustomEmails] = useState({
    whom: "",
    cc: "",
    bcc: "",
  });
  // Önerilen e-posta adresleri listesini tutar
  const suggestedEmails = {
    whom: ["kisi@gmail.com", "kisi2@gmail.com", "kisi3@gmail.com"],
    cc: ["cckisi@gmail.com"],
    bcc: ["bcckisi@gmail.com"],
  };

  const toggleDropdown = (field) => {
    setDropdowns((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleEmailSelect = (field, email) => {
    setValue(field, email);
    setDropdowns((prev) => ({ ...prev, [field]: false }));
  };

  const handleCustomEmailChange = (field, value) => {
    setCustomEmails((prev) => ({ ...prev, [field]: value }));
  };

  const handleCustomEmailSubmit = (field) => {
    setValue(field, customEmails[field]);
    setDropdowns((prev) => ({ ...prev, [field]: false }));
  };
 // E-posta gönderme işlemi
const handleSendEmail = () => {
  const to = watch("whom");
  const cc = watch("cc");
  const bcc = watch("bcc");
  const subject = watch("subject");
  const message = watch("message");

  if (!to) {
    alert("Lütfen alıcı adresini girin.");
    return;
  }
  // Parametreleri sırayla mailto linkine ekler
  const params = [];

  if (cc) params.push(`cc=${encodeURIComponent(cc)}`);
  if (bcc) params.push(`bcc=${encodeURIComponent(bcc)}`);
  if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
  if (message) params.push(`body=${encodeURIComponent(message)}`);

  let mailtoLink = `mailto:${to}`;
  if (params.length > 0) {
    mailtoLink += `?${params.join("&")}`;
  }

  window.location.href = mailtoLink;
};


  const selectedEmails = {
    whom: watch("whom"),
    cc: watch("cc"),
    bcc: watch("bcc"),
  };

  return (
    <form className="email-form">
      {["whom", "cc", "bcc"].map((field) => (
        <div key={field} className="form-group">
          <label>{field === "whom" ? "Kime" : field.toUpperCase()}</label>
          <button
            type="button"
            className="dropdown-icon"
            onClick={() => toggleDropdown(field)}
          >
            {selectedEmails[field] ? selectedEmails[field] : <FaRegUser />}
          </button>

          {dropdowns[field] && (
            <div className="dropdown">
              <input
                type="email"
                placeholder="Yeni e-posta girin"
                value={customEmails[field]}
                onChange={(e) => handleCustomEmailChange(field, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleCustomEmailSubmit(field);
                  }
                }}
              />
              <hr />
              {suggestedEmails[field].map((email, idx) => (
                <div
                  key={idx}
                  onClick={() => handleEmailSelect(field, email)}
                  className="dropdown-item"
                >
                  {email}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <div className="form-group">
        <label>Konu</label>
        <input type="text" {...register("subject")} />
      </div>
      <div className="textarea-wrapper">
        <textarea placeholder="E-posta iletisi yazın..." rows={6} {...register("message")} />
      </div>

      <div className="send-button-wrapper">
        <button type="button" onClick={handleSendEmail}>
          <span style={{ fontFamily: "'Rubik Moonrocks', cursive" }}>M</span>
        </button>
      </div>

    </form>
  );
};
