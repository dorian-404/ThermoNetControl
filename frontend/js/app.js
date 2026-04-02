async function connectToArduino() 
{
    try
    {
        const port = await navigator.serial.requestPort();
        await port.open({ baudRate: 9600 }); // Set the baud rate
        const reader = port.readable.getReader();

        // Read data from Arduino
        while (true) 
        {
            const { value, done } = await reader.read();
            if (done) break;
            const data = new TextDecoder().decode(value);
            console.log(data); // Handle received data
        }

        // Write data to Arduino
        const writer = port.writable.getWriter();
        writer.write("Hello Arduino"); // Send data to Arduino
        writer.releaseLock();
    } 
    catch (error) 
    {
    console.error(error);
    }
}


/********************************  Partie Cadran dynamique ***********************************/

var bouton = document.getElementById("boutonValider");

bouton.addEventListener("focus", function() {
  bouton.setAttribute("id", "boutonValider");
});

bouton.addEventListener("blur", function() {
  bouton.removeAttribute("id");
});