const inpFile = document.getElementById('file');
const previewContainer = document.getElementById('imagePreview');
const previewImage = previewContainer.querySelector('.image-preview__image');
const previewDefultText = previewContainer.querySelector('.image-preview__defult-text');

inpFile.addEventListener("change", function () {
    const file = this.files[0];
    

    if (file) {
        const reader = new FileReader();

        previewDefultText.style.display = "none";
        previewImage.style.display = "block";

        reader.addEventListener("load", function () {
            // console.log(this);
            previewImage.setAttribute("src", this.result);
        });

        reader.readAsDataURL(file);
    } else{
        previewDefultText.style.display = null;
        previewImage.style.display = null
        previewImage.setAttribute("src", "");
    }
});