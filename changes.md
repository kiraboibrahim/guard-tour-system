# New features

## Problems raised by clients

### Dissertation

* Security guards resign without any notice. This means the security guard stops coming to the site to make patrols.

### Ghost workers

#### Possible solutions

* Biometric - Fingerprint, Facial recognition
* Image upload when submitting a patrol

  * Security guards will take pics of their face everytime they come for duty
  * The images will be uploaded to the server
  * At the end of the month, the images will be used as proof of presence at the site and that they are the ones that did the patrol

## Requested Changes As of 21 Jan, 2024

* [X]  Limit the number of tags can that can be installed on a site - suggested max is 6 tags
* [X]  Remove authentication for security guards
* [X]  Only site tag Id will be required as a means of 'authentication'
* [X]  Remove deployedSite from security guard entity as the association btn a guard and a site is no longer required because of how frequently security guards will be moving btn sites.
* [X]  Remove the shift entity as it is no longer required.
* [X]  Add a tag ID to the site entity(A unique physical ID)
* [X]  Patrol Entity Changes

  * [X]  Site Tag Id
  * [X]  security guard Unique Id
  * [X]  Date(Start Date of patrol)
  * [X]  Time(Start time of patrol)
  * [X]  Remove end date and time
* [X]  Remove limitation on the length of the tag IDs i.e 10 length requirement as there are going to be tags will have more than 10 digits
* [X]  Security Guard Entity Changes

  * [X]  Remove username
  * [X]  Remove password
  * [X]  Remove deployed Site
  * [X]  Remove Shift
* [X]  Site Entity Changes

  * [X]  Remove patrol frequency field

## Requested Changes As of 28 Jan, 2024

* [ ]  Allow updating the company Id of the site.
* [ ]  Nullify the company Id of a site when a company is deleted instead of deleting the sites when their respective company is deleted(Company contract is due, or sth else). This will allow transfer of ownership of sites between companies
* [ ]  Allow searching of sites by tag Ids.
* [ ]  Fix the double deletion bug. When an object is successfully deleted the first time. Further delete requests of the same object raise a Forbidden error because the permissions service treats this as an unauthorized operation due the object missing in the database. Look at how to treat the non existent objects when checking permissions.
* [ ]  Update the create dto for a security guard to include the lastname, firstname, and phone number

# Testing

### Company Admin - ID: 31

* [X]  Creating
* [X]  Reading
* [X]  Deleting

### Site Admin

* [X]  Creating
* [X]  Reading
* [X]  Updating
* [X]  Deleting

### Security Guards

* [X]  Creating
* [X]  Reading
* [X]  Updating
* [X]  Deleting

### Sites

* [X]  Creating
* [X]  Reading
* [X]  Updating
* [X]  Deleting

### Patrols

* [X]  Creating

## Upcoming Changes

* Rename securityGuardUniqueId to securityGuardTagId
* Refactor the loadEntitiesIfExist and loadEntityIfExists validators to take objects as the arguments to properly communicate the role of the arguments
