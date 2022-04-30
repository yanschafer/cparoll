const writer = function (i = 0, text = "", element) {
    if (i < text.length) {
        element.innerHTML = element.innerHTML.substr(0, element.innerHTML.length - 1);
        element.innerHTML += text.charAt(i) + "|"
        i++
        setTimeout(() => {
            writer(i, text, element)
        }, 75)
    }
    else {
        element.innerHTML = element.innerHTML.substr(0, element.innerHTML.length - 1);
    }
}

const deleter = async function (element) {
    if (element.innerText != "") {
        element.innerText = element.innerText.substr(0, element.innerText.length - 1);
        await deleter(element)
    }
}

let currentBlock2 = 1;

const changeBlock = function (type) {
    currentBlock2 = type;
    if (type === 1) {
        const el = document.getElementById('retype');
        deleter(el).then(() => {
            writer(0, "Monetization", el);
        })
        document.getElementById('block2Content_').style.opacity = '0'
        setTimeout(() => {
            console.log('animation closed');
            document.getElementById('block2Content_').style.display = 'none';
            document.getElementById('block2Content').style.display = 'flex';
            setTimeout(() => {
                document.getElementById('block2Content').style.opacity = '1'
            }, 100)
        }, 1000)
    }
    else {
        const el = document.getElementById('retype');
        deleter(el).then(() => {
            writer(0, "Acquisition", el);
        })
        document.getElementById('block2Content').style.opacity = '0';
        setTimeout(() => {
            console.log('animation closed');
            document.getElementById('block2Content').style.display = 'none';
            document.getElementById('block2Content_').style.display = 'flex';
            setTimeout(() => {
                document.getElementById('block2Content_').style.opacity = '1'
            }, 100)
        }, 1000)
    }
}

let currSection = 1;

const changeLabel = function (img) {
    console.log(img)
    document.getElementById("label").style.opacity = "0";
    setTimeout(() => {
        for (let key in document.getElementById('label').children) {
            if (document.getElementById('label').children[key]['style'])
                document.getElementById('label').children[key].style.display = 'none';
        }
        document.getElementById(img).style.display = 'block';
        document.getElementById("label").style.opacity = "1";
    }, 150)
}

const animate = function (scrollPos) {
    console.log(window.innerHeight)
    console.log()
    if (scrollPos >= document.getElementById('block4Content').offsetTop - window.innerHeight - document.getElementById('block4Content').offsetHeight) {
        document.getElementById('block4Content').style.bottom = "0px";
        setTimeout(() => {
            document.getElementById('block4Content').style.opacity = '1'
        }, 200)
        if (currSection != 4)
            changeLabel( "cu")
        currSection = 4
        return
    }
    else {
        document.getElementById('block4Content').style.bottom = "-400px";
        document.getElementById('block4Content').style.opacity = '0'
    }
    if (scrollPos >= document.getElementById('block3Content').offsetTop - window.innerHeight * 1.3) {
        document.getElementById('block3Content').style.bottom = "0px";
        setTimeout(() => {
            document.getElementById('block3Content').style.opacity = '1'
        }, 200)
        if (currSection != 3)
            changeLabel( "a")
        currSection = 3
        return
    }
    else {
        document.getElementById('block3Content').style.bottom = "-400px";
        document.getElementById('block3Content').style.opacity = '0'
    }
    if (scrollPos >= document.getElementById('block2Content_').offsetTop - window.innerHeight && scrollPos <= document.getElementById('block2Content_').offsetTop + 100) {
        document.getElementById('block2Content').style.bottom = "-400px";
        document.getElementById('block2Content').style.opacity = '0'
        document.getElementById('block2Content_').style.bottom = "-400px";
        document.getElementById('block2Content_').style.opacity = '0'
        if (currSection != 1)
            changeLabel( "sd")
        currSection = 1;
        return
    }
    else if (scrollPos < document.getElementById('block2Content').offsetTop - window.innerHeight / 2) {
        document.getElementById('block2Content').style.bottom = "0px";
        document.getElementById('block2Content_').style.bottom = "0px";
        if (currentBlock2 == 1)
            document.getElementById('block2Content').style.opacity = '1'
        else
            document.getElementById('block2Content_').style.opacity = '1'
        if (currSection != 2)
            changeLabel( "p")
        currSection = 2
        return
    }
    return;
}

window.addEventListener('scroll', function(e) {
    animate(window.scrollY)
});

const scrollToSec = function (num) {
    window.scrollTo({
        top: document.getElementById('sec'+num).offsetTop + (window.innerHeight / 1.5),
        left: 0,
        behavior: 'smooth'
    })
}

document.addEventListener("DOMContentLoaded", function() {
    console.log(111);
    writer(0, "performance", document.getElementById('title-writer-first'))
    setTimeout(() => {
        writer(0, "agency", document.getElementById('title-writer-second'))
        setTimeout(() => {
            const el = document.getElementById('title-writer-second');
            setInterval(() => {
                el.innerHTML += "|"
                setTimeout(() => {
                    el.innerHTML = el.innerHTML.substr(0, el.innerHTML.length - 1);
                }, 300)
            }, 600)
        }, 530)
    }, 925);
});
