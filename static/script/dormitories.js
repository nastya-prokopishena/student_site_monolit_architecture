document.addEventListener("DOMContentLoaded", function () {
    // Get all content__box elements
    var contentBoxes = document.querySelectorAll(".content__box");

    // Add click event listener to each content__box
    contentBoxes.forEach(function (box) {
        box.addEventListener("click", function () {
            // Get the corresponding dormitory ID
            var dormitoryId = box.id.replace("_trigger", "");

            // Toggle the visibility of the corresponding dormitories__content-describtion
            var dormitoryContent = document.getElementById(dormitoryId);
            if (dormitoryContent) {
                dormitoryContent.style.display = (dormitoryContent.style.display === "none") ? "flex" : "none";
            }
        });
    });

    // Get all content-describtio__box-closer elements
    var closers = document.querySelectorAll(".content-describtion__box-closer");

    // Add click event listener to each content-describtio__box-closer
    closers.forEach(function (closer) {
        closer.addEventListener("click", function (event) {
            // Stop the event from propagating to the content__box and triggering its click event
            event.stopPropagation();

            // Get the corresponding dormitory ID to close
            var dormitoryIdToClose = closer.id.replace("closer_", "");

            // Close the corresponding dormitories__content-describtion
            var dormitoryContentToClose = document.getElementById("dormitory_" + dormitoryIdToClose);
            if (dormitoryContentToClose) {
                dormitoryContentToClose.style.display = "none";
            }
        });
    });
});
