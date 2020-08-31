import $ from 'jquery';
import 'waypoints/lib/jquery.waypoints.min.js';
import 'waypoints/src/shortcuts/sticky.js';

class StickyHeader {
  constructor() {
    this.navbarMiddle = $('.navbar__middle');
    this.navbarTop = $('.navbar__top');
    this.navbarBottom = $('.navbar__bottom');
    this.navbarMenu = $('.navbar__top__menu');
    this.modifyCommandCheckout = $('#modify-command-checkout');
    this.offset = this.navbarTop.outerHeight() + 50;
    this.window = $(window);
    this.windowWidth = this.window.width()
    this.windowPosition = this.window.scrollTop();
    this.directionIsDown = false;
    this.sticky;
    this.sticky2
    this.createHeaderWaypoint();
    this.event();
  }

  event() {
    this.window.scroll(this.slideNavBarOnScroll.bind(this));
    this.window.resize(this.updateState.bind(this));
    this.navbarMenu.click(this.navbarMenuButton.bind(this))
  }
  navbarMenuButton() {
    this.navbarMiddle.removeClass('navbar__middle--hide');
    this.navbarMenu.removeClass('navbar__top__menu--open');
    this.directionIsDown = false;
  }
  updateState() {
    this.windowWidth = this.window.width();
    this.offset = this.navbarTop.outerHeight() + 50;
    this.window = $(window);
    this.windowPosition = this.window.scrollTop();
    this.sticky ? this.sticky.destroy() : null;
    this.sticky2 ? this.sticky2.destroy() : null;
    this.createHeaderWaypoint();
  }

  // slide navbar__middle up and down based on direction
  slideNavBarOnScroll() {
    const scroll = this.window.scrollTop();

    if (this.previousPosition > this.offset) {
      if (scroll > this.previousPosition && !this.directionIsDown) {
        if (this.windowWidth < 720) {

          this.navbarMiddle.addClass('navbar__middle--hide')
          this.navbarMenu.addClass('navbar__top__menu--open')
          this.directionIsDown = true
        } else {

          this.navbarMiddle.addClass('navbar__middle--hide');
          this.directionIsDown = true;
        }

      } else if (scroll < this.previousPosition && this.directionIsDown) {

        this.windowWidth >= 720 ? this.navbarMiddle.removeClass('navbar__middle--hide') : null;
        this.directionIsDown = false;

      }
    }
    this.previousPosition = scroll;
  }

  createHeaderWaypoint() {
    let self = this;

    if (this.windowWidth >= 720) {
      this.sticky = new Waypoint.Sticky({
        element: self.navbarMiddle,
        offset: 55,
      });

      this.sticky2 = new Waypoint.Sticky({
        element: self.modifyCommandCheckout,
        offset: 80,
      });
    }
  }
}

new StickyHeader();
export default StickyHeader;
