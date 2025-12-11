"use client";

import { useEffect, useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const [settings, setSettings] = useState<any>(null);

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  // 🔹 Fetch Settings from API
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch("/api/settings");
        const data = await res.json();
        setSettings(data);
      } catch (error) {
        console.error("Failed to load settings", error);
      }
    };

    fetchSettings();
  }, []);

  // 🔹 Handle Form Submit
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    const payload = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      subject: "New General Enquiry Form Submission",
    };

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMsg("Your enquiry has been sent to our team!");
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          message: "",
        });
      } else {
        setErrorMsg(data.error || "Failed to send message. Please try again.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <>
      {/* Banner */}
      <div
        className="relative h-[350px] bg-cover bg-center"
        style={{ backgroundImage: `url('${settings?.contactBanner}')` }}
      >
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

      {/* Contact Section */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          {/* Title */}
          <div className="text-center mb-10">
            <p className="font-bold tracking-tighter">Get in Touch</p>
            <h2 className="text-4xl font-light text-gray-800">Contact Us</h2>
            <p className="text-gray-600 mt-2 max-w-md mx-auto">
              Have questions or need more information? Our team will get back to you soon.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Left Card — Office Info */}
            <div className="bg-white flex flex-col gap-4 rounded-xl shadow-md border border-gray-100">
              <div className="flex flex-col py-2 mt-8 px-2">
                <h3 className="text-xl font-semibold px-3">Head Office</h3>
                <div className="flex flex-row items-center">
                  <img src="/images/contact/address.png" alt="" className="h-20 w-20" />
                  <p className="text-gray-600 text-xs leading-relaxed">
                    {settings?.address || "Address not configured"}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-gray-300"></div>

              <div className="space-y-4 px-4 py-2">
                <div className="flex items-center gap-3">
                  <img src="/images/contact/phone.png" alt="" className="h-14 w-14" />
                  <div>
                    <p>{settings?.contactPhone || "Phone not available"}</p>
                    <p>{settings?.contactPhone2 || "Phone not available"}</p>
                  </div>
                </div>
              </div>

              <div className="h-[1px] bg-gray-300"></div>

              <div className="space-y-4 px-4 py-2">
                <div className="flex items-center gap-3">
                  <img src="/images/contact/mail.png" alt="" className="h-14 w-14" />
                  <div className="flex flex-col">
                    <p>{settings?.contactEmail || "Email not available"}</p>
                    <p>{settings?.websiteUrl || "Website not available"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Form */}
            <div className="md:col-span-2 bg-white p-8 rounded-xl shadow-md border border-gray-100">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <input
                  required
                  placeholder="First name*"
                  className="border rounded-md p-3 w-full"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                />

                <input
                  required
                  placeholder="Last name*"
                  className="border rounded-md p-3 w-full"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                />

                <input
                  required
                  type="email"
                  placeholder="Email Address*"
                  className="border rounded-md p-3 w-full"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />

                <input
                  required
                  type="tel"
                  placeholder="Phone Number*"
                  className="border rounded-md p-3 w-full"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />

                <textarea
                  required
                  placeholder="Drop your message or question here..."
                  className="border rounded-md p-3 w-full md:col-span-2 h-32"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
                <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold py-3 rounded-full md:col-span-2 px-4"
                >
                  {loading ? "Sending..." : "Submit message"}
                </button>
                </div>
                {successMsg && <p className="text-green-600 md:col-span-2">{successMsg}</p>}
                {errorMsg && <p className="text-red-600 md:col-span-2">{errorMsg}</p>}
              </form>
            </div>
          </div>

          {/* Map */}
          <div className="mt-14">
            <iframe
              className="w-full h-[350px] rounded-xl"
              src={settings?.mapUrl}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
    </>
  );
}
