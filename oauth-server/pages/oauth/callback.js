import { useEffect } from "react";

export default function Callback() {
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");
    const error = urlParams.get("error");

    if (error) {
      window.opener.postMessage(
        {
          type: "oauth-error",
          error: error,
        },
        "https://www.figma.com"
      );
    } else if (code) {
      // Exchange code for token
      fetch("/api/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.error) {
            throw new Error(data.error);
          }
          window.opener.postMessage(
            {
              type: "oauth-success",
              access_token: data.access_token,
            },
            "https://www.figma.com"
          );
        })
        .catch((error) => {
          window.opener.postMessage(
            {
              type: "oauth-error",
              error: error.message,
            },
            "https://www.figma.com"
          );
        })
        .finally(() => {
          window.close();
        });
    }
  }, []);

  return <div>인증 처리 중...</div>;
}
