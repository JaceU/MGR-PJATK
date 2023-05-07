//Control left menu visibility status
function visstatus1() {
    document.getElementById("vis1").setAttribute("class", "menu_table menu_option2");
    document.getElementById("vis2").setAttribute("class", "menu_table menu_option1");
    //document.getElementById("vis3").setAttribute("class", "menu_table menu_option1");
}
function visstatus2() {
    document.getElementById("vis1").setAttribute("class", "menu_table menu_option1");
    document.getElementById("vis2").setAttribute("class", "menu_table menu_option2");
    //document.getElementById("vis3").setAttribute("class", "menu_table menu_option1");
}
//just text
var c = document.getElementById("testCanvas");
var ctx = c.getContext("2d");
ctx.font = "30px Arial";
ctx.fillText("Canvas Test", 10, 50);
//
