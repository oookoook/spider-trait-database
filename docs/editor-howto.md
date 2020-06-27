# Guidelines on how to edit a dataset

The data editor is controlled by the toolbar above the data table.

![Toolbar](img/toolbar.gif)

The toolbar buttons from left to right are divided into several groups:

## Dataset-level operations

Buttons in this group affect whole datasets or all records.

* Dataset detail - Opens the dataset detail form. Allows dataset properties to be viewed and edited (e.g., Dataset name, Uploader name, Authors)
* Upload data - After clicking the button, a dialog appears that allows an Excel or CSV file to be selected from the hard drive and uploaded to the server. This can take some time.
* Download as CSV - Can be used to save the current state of the dataset to the user's hard drive. The file can then be used as a backup or can be modified in a table processor such as Excel, where more complex edits can be performed, before being re-uploaded to the Spider Trait Database.
* Delete all the data - Deletes all rows, but keeps the empty dataset. Requires confirmation before deleting.
* Delete the dataset - Deletes all data, as well as the dataset information itself. Requires confirmation before deleting.

![Upload](img/upload.gif)

## Data filters

The data filters help the user to identify rows that require editing. The number of records in the bottom right corner of the table can help to determine the total count of records of each type.

![Filters](img/valid-filter.gif)

* Show all records - no filter is applied.
* Show valid rows - only valid rows are displayed.
* Show invalid rows - only invalid rows are displayed.

## Data display

The only button in the display section toggles between (i) shortening long values to make the sheet more compact and easy to work with and (ii) viewing the unaltered values.

![Shortening](img/shortening.gif)

## Data editing

The buttons in this section are used to modify the data. The following section provides tutorials on common tasks.

* Edit only the selected cell – to edit a single value.
* Edit the selected value in the whole column - serves as a batch replacement of values in one column. Can be used to correct typos or to replace synonyms with accepted values (e.g. `minimum` to `min` in the `measure` column)
* Use this value as a rule for value change - used for operations such as "If value in column A is X, then put value Y in column B". Can be used for various tasks such as filling in trait or method description according to trait/method name or providing additional information (reference DOI, WSC LSID based on original name).
* View distinct values in the selected column - This button lists all distinct values in the column. The replacement rules described above can be executed using the items from the distinct list. Also, the dialog that opens allows the display of _Distinct entities_ for certain columns (`trait_*`, `method_*`,`location_*`, `reference_*`). From that dialog, it is possible to create the entities (i.e. trait, method, location, or reference) that do not exist in the list.
* Delete selected row - deletes the selected row. Requires confirmation before deleting.
* Delete all rows containing selected value - Deletes all the rows that contain the selected value in the selected column. Requires confirmation before deleting.

## Utilities

Buttons in this group are utility buttons that can be used in special cases or when something is not working as expected.

* Open error log - Opens a log of errors. Errors can occur when the application crashes and is reloaded or when the editor attempts to create new entities (methods, traits) and the operation fails (e.g., the entity name is not unique).
* Refresh the table - Requests the data from the server and displays them.
* Revalidate the whole dataset - Can be used if the automatic validation process fails for some reason. This operation can take some time.

## Data submission steps

Buttons in the last group are used for changing the state of the dataset to one of the other possible values: `reviewed`, `rejected`, `approved`.

* Send for review (contributor only) - Allows the contributor to send the dataset for review. The contributor is notified by the colour of the button (orange) and also by the message in the opened dialog if the dataset is not valid. If the dataset is valid, the icon is green. After clicking, a confirmation dialog opens. The contributor can also attach a message to the editor when submitting.
* Reject (editor only) - Rejects the dataset. The dataset is returned to the contributor with an optional message describing the problems and editor's requests.
* Approve (editor only) - This button is active only if the dataset is fully valid. Otherwise, a red inactive icon is shown. If the button is active, it transfers the dataset to the Spider Trait Database.

![Submit for review](img/submitting.gif)

## Data editing examples

In the following section, typical data editing tasks are described in more detail.

### Editing singe cell

This functionality can be used e.g., to correct typos or incorrectly parsed text.

![Editing single cell](img/single-cell.gif)

### Replacing an unrecognized value with a value from an enumeration list (e.g., fixing typos, replacing synonyms)

To replace synonyms in the dataset, it is possible to use _Edit the selected value in the whole column_ action. If the value must comply with an enumeration, the autocomplete function can be used. If a large number of values are replaced, this operation can take a while.

![Replacing](img/replacing.gif)

### Providing a missing value

In some cases the above approach cannot be used – for example, when the target column is empty but should contain multiple distinct values. In such cases, one can use values in another column to serve as a rule for the replacement: _If column A contains value X, replace value in column B with value Y_. As in the previous case, the operation can take a while for large datasets.

Example:

> If `method_name` column contains `Pitfall traps`, fill the column `method_description` with a text.

![Replacing](img/rule.gif)

### Removing a value from a column

Use _Edit the selected value in the whole column_ action and then click the cross in the value input field:

![Deleting value](img/delete-value.gif)

### Deleting records that cannot be made valid

Very similar functions are available for deleting rows. You can either delete a single record or all the records with the given value in a selected column:

![Deleting records](img/delete-records.gif)

### Creating new entities (references, locations, methods, traits)

During the validation process, the editor has to create all new entities that appear in the dataset – references, locations, methods, and, on rare occasions, also new traits. This can be accomplished using the _View distinct values in the selected column_ action and showing the list of entities in the following dialog. There is an option to create the new entities in a batch. However, the tool creates only entities that are visible in the table on the screen. To create all the entities in the whole dataset, the table has to be forced to show all the records. As this might result in loading large amounts of data, showing all the entities can take a while. Creating large numbers of entities (e.g., several hundred) also requires a few minutes to complete.

For references and locations, entity abbreviations are created automatically during the creation process. For traits and methods, the abbreviation must be assigned manually by the editor prior to creating the entities.

![Creating entities](img/entities.gif)

### Replacing unparsable values with valid representations (numbers, timestamps, coordinates)

For this action, usually _Edit the selected value in the whole column_ is used.

The parsable data types are: `value`, `frequency`, `sample_size`, `event_date`,
`latitude`, `longitude`, `country`. See the [template documentation](template.md) for parsing rules.
