/**
 * Created by Michael Lev on 19/02/2017.
 */

// Code for Safari 3.1 to 6.0
document.getElementById("idMyPic").addEventListener("webkitTransitionEnd", myPicTransitionEnded);
// Standard syntax
document.getElementById("idMyPic").addEventListener("transitionend", myPicTransitionEnded);
function myPicTransitionEnded() {
    if (!isMobile()){return;}
    this.style.height = "130px";
    this.style.width  = "130px";
    //setTimeout(function () {//need jquery to reload only the tab
    //    //location.reload(true / false);
    //},3000);
}

// Used to detect whether the users browser is an mobile browser
function isMobile() {
    ///<summary>Detecting whether the browser is a mobile browser or desktop browser</summary>
    ///<returns>A boolean value indicating whether the browser is a mobile browser or not</returns>

    if (sessionStorage.desktop) // desktop storage
        return false;
    else if (localStorage.mobile) // mobile storage
        return true;

    // alternative
    var mobile = ['iphone','ipad','android','blackberry','nokia','opera mini','windows mobile','windows phone','iemobile'];
    for (var i in mobile) if (navigator.userAgent.toLowerCase().indexOf(mobile[i].toLowerCase()) > 0) return true;

    // nothing found.. assume desktop
    return false;
}
//Tabs
function openTab() {//arguments: evt, tabName, tabNamePH(optional)

    const evt=arguments[0];
    const tabName = arguments.length === 3 && isMobile() ? arguments[2] : arguments[1];
    var i;

    // Get all tab elements and hide them
    var array = document.getElementsByClassName("tabContent");
    for (i = 0; i < array.length; i++)
        array[i].style.display = "none";

    // if not "TabContactMe", Get all video/pdf elements and hide them
    if (tabName !== 'TabContactMe') {
        array = document.getElementsByClassName("rowContent");
        for (i = 0; i < array.length; i++)
            array[i].style.display = "none";
    }

    // Get all elements with class="tabButton" and remove the class "active"
    array = document.getElementsByClassName("tabButton");
    for (i = 0; i < array.length; i++)
        array[i].className.replace(" active", "");

    // Show the current tabMain,
    // and add an "active" class to the link that opened the tabMain
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// on click outside an opened Tab, close it
window.onclick = function(event) {
    var i, array;
    if (!event.target.matches('.tabButton')) {
        array = document.getElementsByClassName("tabContent");
        for (i = 0; i < array.length; i++)
            array[i].style.display = "none";

        // Get all elements with class="tabButton" and remove the class "active"
        array = document.getElementsByClassName("tabButton");
        for (i = 0; i < array.length; i++)
            array[i].className.replace(" active", "");
    }
    if (document.getElementsByClassName('dropdown').length) {
        if (!event.target.matches('.dropbtn')) {
            array = document.getElementsByClassName("dropdown-content");
            for (i = 0; i < array.length; i++)
                if (array[i].classList.contains('show'))
                    array[i].classList.remove('show');
        }
    }
    sessionStorage.clickedOutsideTabs = "true";
};
//Rows
function openRow(evt, rowName) {
    // Declare all variables
    var i, rowContents, rowLinks, rows;

    var array = document.getElementsByClassName("tableContent");
    for (i = 0; i < array.length; i++)
        array[i].style.display = "none";

    // Get all elements and hide them
    array = document.getElementsByClassName("rowContent");
    for (i = 0; i < array.length; i++)
        array[i].style.display = "none";

    //rows = document.getElementsByName("Rows");
    //rows.style.display = "none";

    // Get all elements with class="rowLinks" and remove the class "active"
    array = document.getElementsByClassName("rowLinks");
    for (i = 0; i < array.length; i++)
        array[i].className.replace(" active", "");

    // Hide the Heared
    document.getElementById("hdr").style.display = "none";

    // Show the current tabMain,
    // and add an "active" class to the link that opened the tabMain
    document.getElementById(rowName).style.display = "block";

    evt.currentTarget.className += " active";
    //document.getElementById(rowName).style.height = (screen.availHeight) + 'px';
}
// Get the element with id="defaultOpen" and click on it
document.getElementById("defaultOpen").click();

// on dropdown button click, toggle hide/show dropdown content
function dropBtnFunction() {
    document.getElementById("contact-dropdown-content").classList.toggle("show");
}
