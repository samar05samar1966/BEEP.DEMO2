function completeScan(){

document.getElementById("scanText").innerHTML =
"✓ Rider Profile Loaded";


document.querySelector(".loader").style.display="none";


document.getElementById("profile")
.classList.remove("hidden");

}