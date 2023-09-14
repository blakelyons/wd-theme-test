var programLoad = false;
var resLoad = false;
var voucherLoad = false;
var baseURL = 'https://asoft100117.accrisoft.com/themelibrary01/mt/';

function getCookie(name) {
    // Split cookie string and get all individual name=value pairs in an array
    var cookieArr = document.cookie.split(";");

    // Loop through the array elements
    for(var i = 0; i < cookieArr.length; i++) {
        var cookiePair = cookieArr[i].split("=");

        /* Removing whitespace at the beginning of the cookie name
        and compare it with the given string */
        if(name == cookiePair[0].trim()) {
            // Decode the cookie value and return
            return decodeURIComponent(cookiePair[1]);
        }
    }

    // Return null if not found
    return null;
}

function loadData(content) {
    let obj;
    let request = new XMLHttpRequest();
    let admin = getCookie('ActingCompany');
    let url = '';

    if (content == "programs" && !programLoad){
        url = baseURL + 'api/account/programRegistration.findAll';
        if (admin) {
            url += '?where={"employees":true}';
        } else {
            url += '?where={"employees":false}';
        }
        request.open("GET", url);
        request.send();
        request.onload = () => {
            if(request.status === 200) {
                console.log(JSON.parse(request.response));
                obj = JSON.parse(request.response);
                console.log(obj.data);
                loadPrograms(obj.data);
            } else {
                //console.log('error ${request.status} ${request.statusText}')
                //add "error loading data" to the popup
            }
        }
        programLoad = true;
    } else if (content == "res" && !resLoad){
        url = baseURL + 'api/account/reservation.findAll';
        if (admin) {
            url += '?where={"employees":true}';
        }
        console.log(url);
        request.open("GET", url);
        request.send();
        request.onload = () => {
            if(request.status === 200) {
                console.log(JSON.parse(request.response));
                obj = JSON.parse(request.response);
                console.log(obj.data);
                loadRes(obj.data);
            } else {
                //console.log('error ${request.status} ${request.statusText}')
                //add "error loading data" to the popup
            }
        }
        resLoad = true;
    } else if (content == "vouchers" && !voucherLoad){
        url = baseURL + 'api/account/voucher.findAll';
        if (admin) {
            url += '?where={"employees":true}';
        }
        console.log(url);
        request.open("GET", url);
        request.send();
        request.onload = () => {
            if(request.status === 200) {
                console.log(JSON.parse(request.response));
                obj = JSON.parse(request.response);
                console.log(obj.data);
                loadVouchers(obj.data);
            } else {
                //console.log('error ${request.status} ${request.statusText}')
                //add "error loading data" to the popup
            }
        }
        voucherLoad = true;
    }


}

function loadPrograms (data) {
    if (data.length === 0) {
        $('.no-course').show();
    } else {
        for (i=0;i<data.length;i++){
            let template = $.trim($('#templateItem').html()),
                dataVals = template.replace(/{{name}}/ig, (data[i].firstName + " " + data[i].lastName))
                    .replace(/{{email}}/ig, data[i].email)
                    .replace(/{{course}}/ig, data[i].courseName)
                    .replace(/{{ticket}}/ig, data[i].ticketName)
                    .replace(/{{price}}/ig, data[i].price)
                    .replace(/{{status}}/ig, data[i].status)
                    .replace(/{{date}}/ig, data[i].courseStart);
            $(dataVals).appendTo('#programTable');
        }
        $('#programTable').show();
    }
}

function loadRes (data) {
    console.log("Res Data");
    console.log(data);
    if (data.length === 0) {
        $('.no-res').show();
    } else {
        for (i=0;i<data.length;i++){
            let dateFormat = 'MM/DD/YYYY - h:mm a';
            let startDate = moment(data[i].startDate).format(dateFormat);
            let endDate = moment(data[i].endDate).format(dateFormat);

            console.log("Start Date: " + startDate);
            console.log("End Date: " + endDate);

            let template = $.trim($('#templateRes').html()),
                dataVals = template.replace(/{{name}}/ig, (data[i].name))
                    .replace(/{{res}}/ig, (data[i].description + "<br />" + data[i].notes))
                    .replace(/{{res_start_end}}/ig, ('<b>Start:</b> ' + startDate + '<br /><b>End:</b> ' + endDate));
            $(dataVals).appendTo('#resTable');
        }
        $('#resTable').show();
    }
}

function loadVouchers (data) {
    console.log("Voucher Data");
    console.log(data);
    if (data.length === 0) {
        $('.no-voucher').show();
    } else {
        for (i=0;i<data.length;i++){

            let available = data[i].available + data[i].used;
            let left = data[i].available;


            let template = $.trim($('#templateVouchers').html()),
                dataVals = template.replace(/{{name}}/ig, (data[i].member))
                    .replace(/{{desc}}/ig, (data[i].description))
                    .replace(/{{available}}/ig, (left + ' of ' + available));
            $(dataVals).appendTo('#voucherTable');
        }
        $('#voucherTable').show();
    }
}

$(document).ready(function(){
    $('.triggerAPI').click(function(e){
        var content = $(this).data('value');
        loadData(content);

    });
});