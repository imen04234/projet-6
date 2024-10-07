(async function getWorks() {
  const response = await fetch("http://localhost:5678/api/work");
  return await response.json();
})

//document.querySelector("").innerHTML = "";
