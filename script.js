(function () {
    function getCookie(name) {
      const cookies = document.cookie.split("; ");
      for (let cookie of cookies) {
        const [key, value] = cookie.split("=");
        if (key === name) {
          return value;
        }
      }
      return null;
    }
  
    const username = getCookie("username");
    if (!username) {
      window.location.href = "/login";
    }
  })();