let isContactOpen = false;
////////////////////////////////////// dodaj funkciju da ispise ... ako je naslov vijesti predugacak!

// Box shadow animation for card flipping
const boxShadowController = x => {
	// the element's current target is going to be HTMLDocument
	// if it gets clicked through JQuery apparently
	let element =
		typeof x.currentTarget !== HTMLDocument ? x.currentTarget : x.target;

	// calculate the spread and blur
	let spread = $(window).width() < 992 ? 1 : 2;
	let blur = $(window).width() < 992 ? 5 : 10;

	// starting value for the opacity
	let i = 1;

	const remove = setInterval(() => {

		if (i >= 0) {
			// decrease the box shadow opacity and its visibility based on the iterator
			element.style.boxShadow = `0 0 ${Math.ceil(blur * i)}px ${Math.ceil(
				spread * i
			)}px rgba(30, 92, 172, ${i})`;

			// step
			i -= 0.1;
		}
	}, 10);

	// first wait for 300ms to create a more realistic shadowing effect
	const add = setTimeout(() => {
		// stop removing the shadow so that we can start adding it
		clearInterval(remove);

		// remove the class to properly reset it later
		element.classList.remove("tile-box-shadow");

		// set the iterator/opacity to the correct value due to floating point errors
		i = 0;

		setInterval(() => {
			if (i <= 1) {
				// increase shadow and its visibility
				element.style.boxShadow = `0 0 ${Math.ceil(blur * i)}px ${Math.ceil(
					spread * i
				)}px rgba(30, 92, 172, ${i})`;
				i += 0.05;
			}
		}, 20);
	}, 300);

	// reset the class
	setTimeout(() => {
		element.classList.add("tile-box-shadow");
		clearInterval(add);
	}, 500);
};

$(document).ready(function () {
	// initialise the Flip plugin
	$(".tile-box").flip();

	// assign the box shadow animation on every click
	$(".tile-box").click(boxShadowController);

	// toggle contacts for the auto-scroll-to-contact animation
	$("#chat-tile").click(() => {
		isContactOpen = !isContactOpen;
	});

	// the auto-scroll-to-contact animation
	$("#contact-btn").on("click", () => {
		// get the DOM element version of the JQuery #chat-tile object
		let element = $(window).width() < 768 ? $("#chat-tile")[0] : $("#tile-section")[0]; ;

		// set a larger timeout since it takes more time to scroll
		// on mobile devices
		let timeout = $(window).width() < 768 ? 1200 : 1000;

		// smooth scrolling settings and animation
		element.scrollIntoView({ behavior: "smooth" });

		setTimeout(() => {}, timeout);

		// wait longer than the timeout for the check to properly go through
		setTimeout(() => {
			// if the contact is not already open
			// click the tile once the page scrolled down
			if (!isContactOpen) {
				$("#chat-tile").click();
			}
		}, timeout + 1);
	});

	$(window).resize(function () {
		showMenuBtn();
	});

	$(window).trigger("resize");

	// open menu on mobile
	function showMenuBtn() {
		if ($(window).width() < 1199.98) {
			$(".open_menu").addClass("d-block");
			$("header nav").addClass("d-none");
			$(".navigation_mobile").removeClass("opened");
		} else {
			$(".open_menu").removeClass("d-block");
			$("header nav").removeClass("d-none");
			$(".navigation_mobile").removeClass("opened");
		}
	}

	$(".open_menu").click(function (event) {
		event.preventDefault();
		$(".navigation_mobile").addClass("opened");
	});

	$(".close_menu, header, section, footer, .navigation_mobile .inner a").click(
		function (event) {
			$(".navigation_mobile").removeClass("opened");
		}
	);

	// Enable AOS plugin (blocks animations)

	if (typeof AOS !== "undefined") {
		AOS.init({
			easing: "ease-out-cubic",
			offset: 50
		});
		setTimeout(function () {
			if ($(".slick-initialized").length > 0) {
				AOS.refreshHard();
			}
		}, 200);
	}

	// Google maps initialisation

	if ($(".js-google-map").length > 0) {
		$(".js-google-map").each(function () {
			var map;
			var map_container = this;
			if ($(map_container).attr("data-coords") != undefined) {
				var coords = $(map_container)
					.attr("data-coords")
					.replace(" ", "")
					.split(",");
				coords = new google.maps.LatLng(
					parseFloat(coords[0]),
					parseFloat(coords[1])
				);
			} else {
				var coords = new google.maps.LatLng(38.89771, -77.03653);
			}
			if (
				$(map_container).attr("data-marker") != undefined &&
				$(map_container).attr("data-marker-size") != undefined
			) {
				var marker_image = $(map_container).attr("data-marker");
				var marker_size = $(map_container).attr("data-marker-size").split("*");
			}
			if ($(map_container).attr("data-zoom") != undefined) {
				var zoom = parseInt($(map_container).attr("data-zoom"));
			} else {
				var zoom = 10;
			}

			function init() {
				var mapOptions = {
						zoom: zoom,
						center: coords
					},
					map = new google.maps.Map(map_container, mapOptions);
				if (marker_image) {
					var marker_icon = {
							url: marker_image,
							scaledSize: new google.maps.Size(marker_size[0], marker_size[1]),
							origin: new google.maps.Point(0, 0),
							anchor: new google.maps.Point(marker_size[0] / 2, marker_size[1])
						},
						marker = new google.maps.Marker({
							position: coords,
							map: map,
							icon: marker_icon
						});
				}
			}

			init();
		});
	}
}); // document.ready end
