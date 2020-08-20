<template>
  <v-container>
    <h1 class="text-h2 text-center font-weight-bold pt-16 pb-10">Contribute data</h1>
    <hr class="primary mx-auto" style="height:3px; border:none;width:80%" />

    <v-row justify="space-between" align="center" class="my-16">
      <v-col cols="7" class="about-text text-xl-h5 text-subtitle-1">
      Anybody is welcome to contribute data to the database. Since many journals require data to be made publicly available, 
      the database can be used as a free public repository. As an alternative to standard databases such as Dryad, the WST 
      database will have a higher visibility as it can be searched in different contexts and presented in systematic reviews conducted 
      through the database. If you wish to contribute data, please read below to find the procedure and rules of data submission, 
      and a tutorial on data modification using the online data editing tool.
      </v-col>
      <v-col cols="4">
        <v-img contain width="497" :src="require('../assets/contribute.png')" />
      </v-col>
    </v-row>


    <v-row justify="space-between" align="center" class="my-16">
      <v-col cols="4">
        <v-img contain width="515" :src="require('../assets/contact.png')" />
      </v-col>
      <v-col cols="7" class="about-text text-xl-h5 text-subtitle-1">
      If you are ready to contribute data to the database, please contact the <a href="mailto:spidertraits@sci.muni.cz">administrator</a>. 
      You will receive a username and a password, which will give you access to the submission page.
      </v-col>
    </v-row>

    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:80%" />

    <h2 class="text-h2 text-center font-weight-bold pt-16 pb-10">Preparation of the dataset</h2>

<p class="about-text text-xl-h5 text-subtitle-1">Before the dataset can be added to the database, the data must be in a valid format. Please download the <a href="https://github.com/oookoook/spider-trait-database/raw/master/docs/template.xlsx">Template</a> spreadsheet and fill in your data. The spreadsheet includes two sheets. The first, titled <em>template</em>, contains 31 columns that can be filled. The definitions of the columns are given in comments to the cells or can be found in the <a href="https://github.com/oookoook/spider-trait-database/blob/master/docs/template.md">template documentation</a>. The second sheet, titled <em>examples</em>, includes examples on how to fill in your data. Some columns in the first sheet are mandatory (highlighted in red or orange), which means that all cells in these columns must be filled with appropriate numerical or character values. Either the red or orange columns must be filled (not both). Eligible values for the red columns can be found in the <router-link to="/traits">Lists &ndash; Traits</router-link> and <router-link to="/methods">List &ndash; Methods</router-link>. Specifically, the contributor should provide either only the <code>trait_abbrev</code> if the trait already exists in the List of Traits or all of the following &ndash; <code>trait_category</code>, <code>trait_name</code>, <code>trait_description</code>, <code>trait_data_type</code>, and <code>trait_unit</code> &ndash; if there is no such trait defined. In these cases the editor will create a new <code>trait_abbrev</code> using the information you provide.

The contributor should also provide either only the <code>method_abbrev</code> if the method already exists in the List of Methods or both the <code>method_name</code> and <code>method_description</code> if there is no such method defined. In these cases the editor will create a new <code>method_abbrev</code> using the information you provide. Similarly, for references, the contributor either provides a code according to the List of References in the <code>reference_abbrev</code> column or a full citation in <code>reference</code> if the source is not in the references list. The <code>reference_abbrev</code> will be generated and assigned to the correct records as part of the application process.</p>
<p class="about-text text-xl-h5 text-subtitle-1">The data should then be saved either as an Excel or a CSV (comma separated) file. In the case of CSV files the values should be separated by commas. Furthermore, the file should be encoded as UTF-8 otherwise characters from national alphabets (accents) will not be correctly processed. The CSV files can be converted to the UTF-8 using, for example, Notepad within Windows by choosing <em>UTF-8</em> encoding from the menu when saving the file.</p>

<h2 class="text-h2 text-center font-weight-bold pt-16 pb-10">Submission procedure</h2>

<p class="about-text text-xl-h5 text-subtitle-1">Go to the top menu and select <router-link to="/import">Contribute &ndash; Import datasets</router-link>. To create a new dataset click the (green) plus sign in the upper right corner of the page. A new dataset form will appear.</p>
<p class="about-text text-xl-h5 text-subtitle-1">You will need to fill in the following information:</p>
<!--
<ul class="about-text text-xl-h5 text-subtitle-1">
<li>Dataset name – Generated automatically, but can be changed to a user defined value. The dataset name must be unique, but a unique random id is attached to the provided name so that the contributor does not have to worry about the uniqueness of the dataset name.</li>
<li>Uploader name – Mandatory field. Automatically filled in from the user profile, but can be changed by the user.</li>
<li>Uploader e-mail – Mandatory field. E-mail of the person who uploads the data. It will be available only to the editor and administrator and used to contact the author uploader.</li>
<li>Authors – Optional. List of authors of the dataset. This may or may not include the uploader.</li>
<li>Author email(s) – Optional. E-mail address(es) of the author(s). It/They will be available only to the editor and administrator.</li>
<li>Notes – Optional. Any additional information passed to the editor concerning the dataset.</li>
</ul>
-->
<h3 class="text-h6">Dataset name</h3><p class="about-text text-xl-h5 text-subtitle-1">Generated automatically, but can be changed to a user defined value. The dataset name must be unique, but a unique random id will be attached to the provided name so that the contributor does not have to worry about the uniqueness of the dataset name.</p>
<h3 class="text-h6">Uploader name</h3><p class="about-text text-xl-h5 text-subtitle-1">Mandatory field. Automatically filled in from the user profile, but can be changed by the user.</p>
<h3 class="text-h6">Uploader e-mail</h3><p class="about-text text-xl-h5 text-subtitle-1">Mandatory field. E-mail of the person who uploads the data. It will be available only to the editor and administrator and used to contact the author uploader.</p>
<h3 class="text-h6">Authors</h3><p class="about-text text-xl-h5 text-subtitle-1">Optional. List of authors of the dataset. This may or may not include the uploader.</p>
<h3 class="text-h6">Author email(s)</h3><p class="about-text text-xl-h5 text-subtitle-1">Optional. E-mail address(es) of the author(s). Author email addresses will only be available to the editor and administrator.</p>
<h3 class="text-h6">Notes</h3><p class="about-text text-xl-h5 text-subtitle-1 mb-16">Optional. Any additional information to be passed to the editor concerning the dataset.</p>

<p class="about-text text-xl-h5 text-subtitle-1">Then, the dataset sheet is created and the contributor is able to upload the data. The data from a file can be uploaded by clicking the <em>Upload</em> button. The data from the Template spreadsheet will be imported to the temporary cache, where the dataset will await approval by the editor.</p>
<p class="about-text text-xl-h5 text-subtitle-1">At this stage, the contributor can look at the dataset and edit it using the web application tools in the green bar above the spreadsheet. The editing interface notifies users of invalid records and properties in the dataset by highlighting such cells in red. The contributor must edit the data in order to comply with the database requirements. See <a href="https://github.com/oookoook/spider-trait-database/blob/master/docs/editor-howto.md">guidelines on how to edit the dataset</a> for more information.</p>
<p class="about-text text-xl-h5 text-subtitle-1">When the contributor completes the changes and the dataset is valid, they can send the dataset to the editor for review (by clicking the <em>Send for review</em> button). The contributor can include a message to the editor when submitting the dataset for review in which they can explain any problems they had encountered while editing the dataset.</p>
<p class="about-text text-xl-h5 text-subtitle-1">Once the dataset is validated by the editor it will be submitted to the database. This means that all the data are transferred from the temporary import cache to the main database and become available for the general public to view and download.</p>
<p class="about-text text-xl-h5 text-subtitle-1">If the dataset is rejected by the editor, the contributor can edit the dataset again by clicking the pen icon on the right. The contributor can also view any message from the editor by clicking the arrow that points downward.</p>
<p class="about-text text-xl-h5 text-subtitle-1">Thank you for considering contributing your data to the world spider database and if you have any further questions please contact us at <a href="mailto:spidertraits@sci.muni.cz">spidertraits@sci.muni.cz</a>.</p>
  </v-container>
</template>
<style scoped>
  .about-text {
    line-height: 2.5rem;
    color: #646464;
  }
</style>