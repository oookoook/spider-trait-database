<template>
  <v-container>
    <h1 class="text-h2 text-center font-weight-bold pt-16 pb-10">About this project</h1>
    <hr class="primary mx-auto" style="height:3px; border:none;width:80%" />
    <v-row justify="space-between" align="center" class="my-16">
      <v-col cols="6" class="about-text text-xl-h5 text-subtitle-1">
      <div>
        <p class="mb-5">The development of the database was initiated by a workshop held at the 21st International Congress of Arachnology in Christchurch, New Zealand. 
        During this workshop, a core team was established to conceptualise, develop and test the database.</p>
        <p>The WST database has been designed to contain 
        trait data in a broad sense, from morphological traits to ecological characteristics, ecophysiology, behavioural habits, and more 
        (see <router-link to="/traits">Lists – Traits</router-link> for current bait of traits). The data includes individual measurements, observations, or composite characteristics, 
        but exclude molecular data (such as DNA or protein sequences). 
        Faunistic records are also included if these contain reference to a species traits (e.g. habitat type), 
        and there is an option for all records to be geo-referenced. For more details, see Lowe et al. (2020).</p>
      </div>
      </v-col>
      <v-col cols="4">
        <v-img contain eager class="rounded-pill elevation-15" :src="require('../assets/spider2.jpg')" />
      </v-col>
    </v-row>

    <v-row justify="space-between"  align="center" class="my-16">
      <v-col cols="4">
        <v-img contain eager class="rounded-pill elevation-15" :src="require('../assets/spider3.jpg')" />
      </v-col>
      <v-col cols="6" class="about-text text-xl-h5 text-subtitle-1">
      <div>
        <p class="mb-5">The database is linked with the <a href="https://wsc.nmbe.ch/" target="_blank">World Spider Catalog</a> and has comprehensive search options and export capability. The entered trait records have been standardized, 
        quality checked by authors, and approved by the editor. </p>
        <p>This database is supported, hosted, developed, and maintained at the Department of Botany and Zoology of Masaryk University in collaboration with the University IT centre. 
        The project is headed by Stano Pekár. The current editor is Ľudmila Černecká.</p>
      </div>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center" class="my-16">
      <v-col cols="6" class="about-text text-xl-h5 text-subtitle-1">
      <div><p>
        The core team (in alphabetical order) is: Klaus Birkhofer, Pedro Cardoso, Ludmila Cernecka, Caroline Fukushima, Marie Herberstein, Lizzy Lowe, Stefano Mammola, Stano Pekar, and Jonas Wolff.</li>
      </p></div>
      </v-col>
      <v-col cols="4">
        <v-img contain eager class="rounded-pill elevation-15" :src="require('../assets/spider4.jpg')" />
      </v-col>
    </v-row>
    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:80%" />
      <v-row justify="space-around mt-16">
        <v-col cols="6">
        <p class="about-text text-center text-xl-h5 text-subtitle-1">
          The use of this database is limited to <b>research, educational, non-commercial use</b>. 
          Contained data are publicly available under a CC BY license (Creative Commons Attribution). 
          The user is free to download, share and adapt the data, as long as the Database is cited 
          as the source of the information. This database should be cited as follows:</p>
          <blockquote class="blockquote about-text text-center">
          Pekár S., Černecká Ľ., Wolff J., Mammola S., Cardoso P., Lowe E., Fukushima C.S., Birkhofer K. &amp; Herberstein M.E. 2020. The world spider trait database. Masaryk University, Brno, URL: https://spidertraits.sci.muni.cz
          </blockquote>
        <v-img class="mx-auto mt-16" contain width="153" height="94" :src="require('../assets/edu.png')" />
        </v-col>
      </v-row>

    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:80%" />
    <v-row justify="center" class="mt-16">
      
        <v-img contain max-width="50" max-height="50" width="50" height="50" :src="require('../assets/repair.png')" />
      
      <v-col cols="6"  class="d-flex flex-column">
        <p class="about-text text-center text-xl-h5 text-subtitle-1">
          If you detected errors or malfunctions, please, bring them to our attention by sending a message to <!-- <a href="spidertraits@group.muni.cz">spidertraits@group.muni.cz</a>. -->
        </p>
        <v-btn class="mx-auto mt-8" width="300" x-large rounded color="primary" href="mailto:spidertraits@group.muni.cz">E-mail</v-btn>
        <p class="about-text text-center text-xl-h5 text-subtitle-1 mt-16">Suggestions for improvement of the database are also welcomed.</p>
      </v-col>
      <v-img contain max-width="50" max-height="50" width="50" height="50" :src="require('../assets/repair.png')" />
    </v-row>
  </v-container>
</template>
<style scoped>
  .about-text {
    line-height: 2.5rem;
    color: #646464;
  }

  .about-text li {
    list-style: disc outside url("../assets/bullet.png");
    padding-left: 2rem;
  }
</style>