# Notes

Hello,
In order to stay true to the provided framework as much as I could I decided to use inbuilt .edge templates with a state management library called [knockout.js](https://www.npmjs.com/package/knockout). This way I was able to separate all the business logic into a javascript file (VM - viewmodel) and use .edge templates for the view layer. Worked out kind of reasonable. For the styling I went with SASS and used a dedicated style file for each template.

### Task 1
>Bacon cloning functionality

First I wrote plain javascript that just cloned the image and appended it to the section, but then I thought that since in the next tasks I will need some state management, I would add it at this point and go with a unified way of writing 'pages'.


### Task 2
>Recreate [design](./design.png)

Form can be found on [/checkout](http://localhost:3333/checkout). I approached form build and validation at the same time. 
 

* Divided the form into two logical components - Checkout and Cart. 
* Added the provided Cart state into a Document Script enabling it to be used in javascript. 
* Tried to extract commonly used components into their own separate files. 
* Form is mobile friendly. 
* Credit card dashes are added automatically.
* Modified valid phone number format to match BE validation.
* Tested form on Chrome, Firefox, Edge.

### Task 3
>Provide simple JS validation

User can type only valid keys into input fields & when Confirm is clicked, invalid fields are displayed with error messages.  
### Task 4
>Send form data to the `POST /order` endpoint

Added logic for posting data & added status modal for showing result to the user. Did not process the error data, just displayed as is.

### Screenshots

![Form](https://raw.githubusercontent.com/uldisDevelop/front-end-assignment/master/readmeImages/Form.PNG?raw=true "Form")

![FormFilled](https://raw.githubusercontent.com/uldisDevelop/front-end-assignment/master/readmeImages/FormFilled.PNG?raw=true "FormFilled")

![FormErrors](https://raw.githubusercontent.com/uldisDevelop/front-end-assignment/master/readmeImages/FormErrors.PNG?raw=true "FormErrors")

![FormMobile](https://raw.githubusercontent.com/uldisDevelop/front-end-assignment/master/readmeImages/FormMobile.PNG?raw=true "FormMobile")

![FormSuccess](https://raw.githubusercontent.com/uldisDevelop/front-end-assignment/master/readmeImages/FormSuccess.PNG?raw=true "FormSuccess")

![FormError](https://raw.githubusercontent.com/uldisDevelop/front-end-assignment/master/readmeImages/FormError.PNG?raw=true "FormError")

