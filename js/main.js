$(document).ready(function() {
    $(window).scroll(function() {
        if ($(this).scrollTop() > 50) { // Adjust the 50px to whatever works best for you
            $('#navbar').addClass('nav-shadow');
        } else {
            $('#navbar').removeClass('nav-shadow');
        }
    });
});


function slider_carouselInit() {
    $('.owl-carousel.slider_carousel').owlCarousel({
        dots: false,
        loop: true,
        margin: 30,
        stagePadding: 2,
        autoplay: true,
        nav: true,
        navText: ["<i class='fa-solid fa-arrow-left'></i>","<i class='fa-solid fa-arrow-right'></i>"],
        autoplayTimeout: 1500,
        autoplayHoverPause: true,
        responsive: {
            0: {
                items: 1
            },
            768: {
                items: 2,
            },
            992: {
                items: 3
            }
        }
    });
}
slider_carouselInit();




document.addEventListener('DOMContentLoaded', () => {
   
    const buttons = document.querySelectorAll('.filter-button');

    buttons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove the 'bold' class from all buttons
            buttons.forEach(btn => btn.classList.remove('bold'));
            
            // Add the 'bold' class to the clicked button
            this.classList.add('bold');
        });
    });



    var tabs = document.querySelectorAll('.tab-link');
    tabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            var target = this.getAttribute('data-target');

            // Remove active class from all tabs and content
            tabs.forEach(function(t) {
                t.classList.remove('active');
                document.getElementById(t.getAttribute('data-target')).classList.remove('active');
            });

            // Add active class to clicked tab and content
            tab.classList.add('active');
            document.getElementById(target).classList.add('active');
        });
    });

    const htmlElement = document.documentElement;
    const toggleButton = document.getElementById('darkModeToggle');
    const moonIcon = document.getElementById('moonIcon');
    const sunIcon = document.getElementById('sunIcon');

    // Set the default theme to dark if no setting is found in local storage
    const currentTheme = localStorage.getItem('bsTheme') || 'dark';
    if (currentTheme === 'dark') {
        htmlElement.classList.add('dark-mode');
    } else {
        htmlElement.classList.remove('dark-mode');
    }

    htmlElement.setAttribute('data-bs-theme', currentTheme);
    toggleButton.setAttribute('aria-pressed', currentTheme === 'dark');
    moonIcon.style.display = currentTheme === 'dark' ? 'block' : 'none';
    sunIcon.style.display = currentTheme === 'dark' ? 'none' : 'block';

    toggleButton.addEventListener('click', function () {
        if (htmlElement.classList.contains('dark-mode')) {
            htmlElement.classList.remove('dark-mode');
            localStorage.setItem('bsTheme', 'light');
        } else {
            htmlElement.classList.add('dark-mode');
            localStorage.setItem('bsTheme', 'dark');
        }
        const isDarkMode = htmlElement.getAttribute('data-bs-theme') === 'dark';
        htmlElement.setAttribute('data-bs-theme', isDarkMode ? 'light' : 'dark');
        localStorage.setItem('bsTheme', isDarkMode ? 'light' : 'dark');
        moonIcon.style.display = isDarkMode ? 'none' : 'block';
        sunIcon.style.display = isDarkMode ? 'block' : 'none';
    });
});



new TypeIt("#bio", {
    speed: 100,
    waitUntilVisible: true,
    loop: true
})
.type("Full Stack .NET Developer")
.pause(2000) // Pause for 1 second
.delete() // Deletes "Full Stack .NET Developer"
.type("Always learning new things")
.pause(2000) // Pause for 1 second
.go();








$(document).ready(function() {
    $('.filter-button').click(function() {
        var filterValue = $(this).attr('data-filter');
        // Toggle active button class
        $('.filters-button-group .filter-button').removeClass('active');
        $(this).addClass('active');

        // Filter projects
        if (filterValue === '*') {
            $('.project-item').removeClass('hide').css('transform', 'scale(1)');
        } else {
            $('.project-item').each(function() {
                if (!$(this).hasClass(filterValue.substring(1))) {
                    $(this).css('transform', 'scale(0)').addClass('hide');
                } else {
                    $(this).removeClass('hide').css('transform', 'scale(1)');
                }
            });
        }
    });
});


    (function(){
        emailjs.init("sCPg_3mOYeR9zZ2Cy"); 

        document.getElementById('contact-form').addEventListener('submit', function(event) {
            event.preventDefault();

            // Generate the data to send from the form elements
            var data = {
                to_name: "Shehab",
                from_name: document.getElementById('name').value,
                from_email: document.getElementById('email').value,
                message: document.getElementById('message').value
            };

            emailjs.send("service_zohc6oa", "template_portfolio", data) // Replace with your service ID and template ID
                .then(function(response) {
                    console.log('SUCCESS!', response.status, response.text);
                    alert("Email sent successfully!");
                    document.getElementById('contact-form').reset(); // Clear all fields
                }, function(error) {
                    console.log('FAILED...', error);
                    alert("Failed to send email.");
                });
        });
    })();



    window.onscroll = function() {scrollFunction()};

    function scrollFunction() {
        var btn = document.getElementById("scrollToTopBtn");
        if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
            btn.style.opacity = "1";
            btn.style.visibility = "visible";
        } else {
            btn.style.opacity = "0";
            btn.style.visibility = "hidden";
        }
    }
    
    // When the user clicks on the button, scroll to the top of the document
    document.getElementById("scrollToTopBtn").addEventListener("click", function() {
        document.body.scrollTop = 0; // For Safari
        document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE, and Opera
    });



// script.js
window.addEventListener('load', function() {
    setTimeout(function() {
        var loader = document.getElementById('loader');
        var content = document.getElementById('content');
        loader.style.display = 'none';
        content.style.display = 'block';
    }, 2000); // Time in milliseconds (3000ms = 3 seconds)
});
