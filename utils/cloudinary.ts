export const uploadImageToCloudinary = async (uri: string) => {
    try {
      const data = new FormData();
      data.append("file", {
        uri,
        type: "image/jpeg", // hoặc type động tùy file
        name: "upload.jpg",
      } as any);
      data.append("upload_preset", "mobile");
      data.append("cloud_name", "dfqukquzq");
  
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dfqukquzq/image/upload",
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            // nếu có token thì thêm Authorization
          },
          body: data,
        }
      );
  
      const json = await res.json();
      return json.secure_url;
    } catch (error) {
      console.log("Upload error:", error);
      return null;
    }
  };