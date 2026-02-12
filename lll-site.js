var TxtRotate = function(el, toRotate, period) {
  this.toRotate = toRotate;
  this.el = el;
  this.loopNum = 0;
  this.period = parseInt(period, 10) || 2000;
  this.txt = '';
  this.tick();
  this.isDeleting = false;
};

TxtRotate.prototype.tick = function() {
  var i = this.loopNum % this.toRotate.length;
  var fullTxt = this.toRotate[i];

  if (this.isDeleting) {
    this.txt = fullTxt.substring(0, this.txt.length - 1);
  } else {
    this.txt = fullTxt.substring(0, this.txt.length + 1);
  }

  this.el.innerHTML = '<span class="wrap">'+this.txt+'</span>';

  var that = this;
  var delta = 300 - Math.random() * 100;

  if (this.isDeleting) { delta /= 2; }

  if (!this.isDeleting && this.txt === fullTxt) {
    delta = this.period;
    this.isDeleting = true;
  } else if (this.isDeleting && this.txt === '') {
    this.isDeleting = false;
    this.loopNum++;
    delta = 500;
  }

  setTimeout(function() {
    that.tick();
  }, delta);
};

window.onload = function() {
  var elements = document.getElementsByClassName('txt-rotate');
  for (var i=0; i<elements.length; i++) {
    var toRotate = elements[i].getAttribute('data-rotate');
    var period = elements[i].getAttribute('data-period');
    if (toRotate) {
      new TxtRotate(elements[i], JSON.parse(toRotate), period);
    }
  }
  // INJECT CSS
  var css = document.createElement("style");
  css.type = "text/css";
  css.innerHTML = ".txt-rotate > .wrap { border-right: 0.08em solid #666 }";
  document.body.appendChild(css);
};

// We Need More Slideshows
var slideIndex = [1,1];
var slideId = ["mySlides1", "mySlides2"]
showSlides(1,0);
showSlides(1,1);

function plusSlides(n, no) {
  showSlides(slideIndex[no] += n, no);
}

function showSlides(n, no) {
  var i;
  var x = document.getElementsByClassName(slideId[no]);
  if (n > x.length) {slideIndex[no] = 1}
  if (n <1) {slideIndex[no] = x.length}
  for (i = 0; i < x.length; i++) {
    x[i].style.display = "none";
  }
  x[slideIndex[no]-1].style.display = "block";
}


  // Replace with your Published CSV URL from Google Sheets
  const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTVPdwRX2UFQKNxcCO1KuAvDxKYWiEBALBEri2OGgrzi2EONiIWCzKlOsgNJMsWhwSoL1fetvKxfqmg/pub?output=csv';

  async function updateResourceLinks() {
    try {
      const response = await fetch(csvUrl);
      const text = await response.text();
      
      // Split text into rows and remove the header row
      const rows = text.split('\n').slice(1);

      rows.forEach(row => {
        // Use a regex to split by comma but ignore commas inside quotes
        const cols = row.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        
        if (cols.length >= 3) {
          const title = cols[0].replace(/"/g, "").trim();
          const url = cols[1].replace(/"/g, "").trim();
          const category = cols[2].replace(/"/g, "").trim();

          // Find the <ul> by ID (e.g., "Research-links")
          const listElement = document.getElementById(`${category}-links`);

          if (listElement) {
            // Create the <li><a href="...">Title</a></li> structure
            const li = document.createElement('li');
            const a = document.createElement('a');
            
            a.href = url;
            a.textContent = title;
            a.target = "_blank"; // Opens in new tab
            
            li.appendChild(a);
            listElement.appendChild(li);
          }
        }
      });
    } catch (err) {
      console.error("Could not load resources:", err);
    }
  }

  // Run the function when the page finishes loading
  window.addEventListener('DOMContentLoaded', updateResourceLinks);

