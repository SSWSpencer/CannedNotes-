// Okay so it's like 4 or 5 days after I wrote this extension and it finally got approved by Google to be published to the webstore
// I figured it would probably be a good idea to go in and comment what every line of code does so that if I do (god forbid) ever have to come edit some stuff, it's easier for me to make adjustments. It also makes it abundantly clear that there aren't any viruses/spyware/malicious content/whatever in this. One, because you can see exactly what the code does, and two, because you can see how this is just a bunch of spaghetti held together by prayers, so it should really paint a picture in your head of "this guy couldn't write a virus even if he tried".



// ngl I have no idea what this first line does, I copied it from a basic chrome extension boilerplate snippet. It appears to be the "do stuff" part that does stuff. We're off to a great start, one line in and I already have no idea what my code does
document.addEventListener('DOMContentLoaded', function() {

    // render the "create new" button in the extention tab (line 25)
    renderCreateNewButton();

    // add functionality to the form (line 59)
    makeFormUseful();

    // render the existing canned notes (line 121)
    renderCannedNotes();

    // render the "reset" button (line 260)
    createReset();

  }, false);
  

  // render "create new" button
  const renderCreateNewButton = () =>{

    // create variable to store the div element in which the 'create new' button will be rendered
    let container = document.getElementsByClassName("CNPHeader")[0];

    // create the "create new" button (even though it's a paragraph element, we'll call it a button)
    let createNewButton = document.createElement("p");

    // add the "createCNbutton" class to the 'create new' 'button' (for styling purposes)
    createNewButton.classList.add("createCNbutton");

    // set the text of the "create new" 'button'
    createNewButton.textContent = "(Create New)";

    // bind a click event listener to the 'create new' 'button', which calls handleClickToggleForm() (line 48) when the button is clicked
    createNewButton.addEventListener("click", handleClickToggleForm)

    // append the 'create new' 'button' to the 'container' element (render it to the screen, basically)
    container.appendChild(createNewButton);
  }

  // click handler for the 'create new' button
  // basically toggles the visibility of the 'create new' form
  const handleClickToggleForm = () =>{
    
    // create variable to store the div element containing the creat-new-canned-note form
    let container = document.getElementsByClassName("CNPForm")[0];

    // toggle the 'hidden' class from the div (basically make it invisible or visible, it's not rocket science)
    container.classList.toggle("hidden");
  }


 // make the form actually do stuff
const makeFormUseful = () =>{

    // create variable to store the 'submit' button
    let submitButton = document.getElementById("submit");

    // bind a click event listener to the 'submit' button, which calls handleClickAddNote() (line 71) when the button is clicked
    submitButton.addEventListener("click", handleClickAddNote);
}


// click handler for the 'submit' button
// does a lot of stuff, ironically <i>this</i> is the function that makes the form useful
const handleClickAddNote = () =>{

    // create variable to store the 'name' input field on the form (it would be more-appropriately named 'title', but crucify me)
    let nameField = document.getElementById("name");

    // create variable to store the 'value' input field on the form
    let valueField = document.getElementById("value");

    // use the chrome storage api to get the list of existing canned notes
    chrome.storage.sync.get("CustomCannedNotes", function(results){
        
        // set a value to the returned results
        let cannedNotes = results.CustomCannedNotes;

        // if there are existing canned notes stored in the value
        if(cannedNotes){
            
            // add the user-created canned note name/value to the existing canned notes array
            cannedNotes.push({name: nameField.value, value: valueField.value})
        }
        
        // if there are no existing canned notes stored in the value
        else{
            // set cannedNotes to be an array containing the user-created canned note name/value
            cannedNotes = [{name: nameField.value, value: valueField.value}]
        }

        // set the canned notes stored in chrome's storage api to the newly-created array (containing the existing ones plus the new user-created one)
        chrome.storage.sync.set({"CustomCannedNotes": cannedNotes}, function(){

            // oh boy I forgot to remove this console.log
            console.log(cannedNotes)

            // call the renderCannedNotes() (line 121) function to re-render the canned notes, including the newly-added one
            renderCannedNotes();

            // clear the form value for 'name'
            nameField.value = "";

            // clear the form value for 'value
            valueField.value = "";

            // toggle the form's visibility
            handleClickToggleForm();
        })
    })
}


// create the canned notes and render them to the screen
const renderCannedNotes = () =>{
    // create variable to store the div element in which the canned notes will be rendered
    const container = document.getElementsByClassName("CNPContent")[0];

    // clear the container's current HTML (so that this function also works to re-render them without duplicate renditions)
    container.innerHTML = "";

    // get the canned notes from the chrome storage api
    chrome.storage.sync.get("CustomCannedNotes", function(result){

        // create a variable to store the returned canned notes from chrome's storage api
        let data = result.CustomCannedNotes;

        // if there is data returned
        if(data){

            // if 'data' is an array and isn't empty
            if(data.length >= 1){

                // loop through every item in the 'data' array
                for(let i = 0; i < data.length; i++){
                    
                    // create a string for the specific item's name property 
                    let name = data[i].name;

                    // create a string for the specific item's value property
                    let value = data[i].value;

                    // call the createNote() (line 158) function passing in the name and value
                    createNote(name, value);
                }
            }
        }
    })
}

// create a canned note element and render it to dom. take name and value as parameters
const createNote = (name, value) =>{

    // oh boy redundant code, look on line (idk, somewhere in the beginning) if you wanna know exactly what this does
    const container = document.getElementsByClassName("CNPContent")[0];

    // create a div element for the canned note
    const cannedNote = document.createElement('div');

    // add the "cannedNote" class to the div element for the canned note
    cannedNote.classList.add("cannedNote");

    // create a paragraph element for the name of the canned note
    const pname = document.createElement("p");

    // create a paragraph element that will function as the canned note's delete button
    const pdel = document.createElement("p");

    // add the 'note' class to the name of the canned note element
    pname.classList.add("note");

    // add the 'del' class to the name of the delete button element
    pdel.classList.add("del");

    // set the delete button's text content to look like a delete button
    pdel.textContent = "[X]"

    // bind a click event listener to the delete button that will handle the deletion of a specific canned note
    pdel.addEventListener("click", function(){

        // confirm that the user wants to delete the canned note
        if(confirm("Are you sure you would like to delete '"+ pname.textContent +"'?")){
            
            // call the handleDelete() (line 217) function to delete the selected canned note. pass the name of the canned note into it as a parameter
            handleDelete(pname.textContent);
        }
    })

    // set the text content of the canned note name to the 'name' parameter
    pname.textContent = name;

    // add a click event listener to the canned note name that copies its value to the user's clipboard
    pname.addEventListener("click", function(){

        // set the user's clipboard to the 'value' parameter
        navigator.clipboard.writeText(value)
    })

    // append the name element to the "cannedNote" div
    cannedNote.appendChild(pname);

    // append the delete button element to the 'cannedNote' div
    cannedNote.appendChild(pdel);

    // append the "cannedNote" div to the 'container' div
    container.appendChild(cannedNote);
}


// handle the deletion of a selected canned note. take in 'item' as the parameter for the canned note to be deleted
const handleDelete = (item) =>{

    // get the canned notes from the chrome storage api
    chrome.storage.sync.get("CustomCannedNotes", function(results){

        // set the returned results to a variable
        let res = results.CustomCannedNotes;

        // create a new array to store the new data (the existing canned notes minus the one that the user wanted to delete)
        let newArr = [];

        // oops i forgot to remove another console.log
        console.log(res);

        // loop through all of the returned canned notes from the storage api
        for(let i = 0 ; i < res.length ; i++){

            // if the name of a certain item in the canned notes array is NOT the same as the 'item' parameter (the one that should be deleted)
            if(res[i].name !== item){

                // add the item to the 'new' array
                newArr.push(res[i]);
            }
            // else:
                // do nothing, we're deleting it.
        // you might be thinking, "won't this delete more than one canned note if they're named the same thing?"
        // yes. yes it will. crucify me (or, idk, don't name more than one thing the same thing)
        }

        // set the value of the canned notes in the storage api to the new array of canned notes (which should be the old canned notes minus the one to be deleted)
        chrome.storage.sync.set({"CustomCannedNotes": newArr}, function(){

            // it appears I missed a third console.log before publishing. oops.
            console.log(newArr);

            // call the renderCannedNotes() (line 121) function to re-render the canned notes
            renderCannedNotes();
        })
    })
}


// render the 'reset' button
const createReset = () => {

    // oh hey i've seen this one before
    let container = document.getElementsByClassName("CNPBottom")[0];

    // create a paragraph element to function as the 'reset' button
    let resetButton = document.createElement("p");

    // add the 'resetButton' class to the reset button
    resetButton.classList.add("resetButton");

    // set the reset button's text content to '(Reset)'
    resetButton.textContent = ("(Reset)")

    // bind a click event listener to the reset button
    resetButton.addEventListener("click", function(){

        // confirm that the user actually wants to delete all the canned notes
        if(confirm("Are you sure you would like to clear all canned notes?")){

            // confirm that the user is sure that they're sure that they want to delete all of the canned notes
            if(confirm("Are you sure? This cannot be undone!")){

                // delete all the canned notes for the user from the storage api
                chrome.storage.sync.set({"CustomCannedNotes": null}, function(){

                    // wow i'm terrible at this
                    console.log([])

                    // re-render the (not-existing-anymore) canned notes
                    renderCannedNotes();
                })
            }
        }
    })
    
    // append the reset button to the container div
    container.appendChild(resetButton);
}
