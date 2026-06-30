<template>
  <v-container>
    <h1 class="text-h2 text-center font-weight-bold pt-16 pb-10">About this project</h1>
    <hr class="primary mx-auto" style="height:3px; border:none;width:80%" />
    <v-row justify="space-between" align="center" class="my-16">
      <v-col cols="6" class="about-text text-xl-h5 text-subtitle-1">
      <div>
        <p class="mb-5">This database is an extension of the World Spider Trait database which has been launched in 2021 (Pekár et al. 2021).</p>
        <p>The WAT database has been designed to contain trait data in a broad sense, from morphological traits to ecological characteristics, ecophysiology, behavioural habits, and more (see <router-link to="/traits">Lists – Traits</router-link> for current bait of traits). The data includes individual measurements, observations, or composite characteristics, but exclude molecular data (such as DNA or protein sequences). Faunistic records are also included if these contain reference to species traits (e.g. habitat type), and there is an option for all records to be geo-referenced.</p>
      </div>
      </v-col>
      <v-col cols="4">
        <v-img contain eager class="rounded-pill elevation-15" :src="spider2Img" />
      </v-col>
    </v-row>

    <v-row justify="space-between"  align="center" class="my-16">
      <v-col cols="4">
        <v-img contain eager class="rounded-pill elevation-15" :src="spider3Img" />
      </v-col>
      <v-col cols="6" class="about-text text-xl-h5 text-subtitle-1">
      <div>
        <p class="mb-5">The database is linked with the <a href="https://wsc.nmbe.ch/" target="_blank">World Arachnida Catalog</a> and in future it shall be linked with catalogues of other orders. It has comprehensive search options and export capability. The entered trait records have been standardized, 
        quality checked by authors, and approved by the editor. </p>
        <p>This database is supported, hosted, developed, and maintained at the Department of Botany and Zoology of Masaryk University in collaboration with the University IT centre. 
        The project is headed and edited by Stano Pekár.</p>
      </div>
      </v-col>
    </v-row>

    <v-row justify="space-between" align="center" class="my-16">
      <v-col cols="6" class="about-text text-xl-h5 text-subtitle-1">
      <div><p>
        The team (in alphabetical order) is: J. Blasco, M. Domenech, A. H. Faiz, L.F. Garcia, R. Jones, C. Komposch, S. Mammola, S. Muller, T. Novak, G. Silva de Miranda, Y. Simone, M. Villela.
      </p></div>
      </v-col>
      <v-col cols="4">
        <v-img contain eager class="rounded-pill elevation-15" :src="spider4Img" />
      </v-col>
    </v-row>
    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:80%" />
      <v-row justify="space-around mt-16">
        <v-col cols="6">
        <p class="about-text text-center text-xl-h5 text-subtitle-1">
          The use of this database is not limited. Contained data are publicly available under a CC BY license (Creative Commons Attribution).
          The user is free to download, share and adapt the data, as long as the Database is cited
          as the source of the information. This database should be cited as follows:</p>
          <blockquote class="blockquote about-text text-center">
          Pekár et al. 2027. The World Arachnida Trait database: a centralised global open repository for curated data on traits of arachnid orders.
          </blockquote>
        <v-img class="mx-auto mt-16" contain width="153" height="94" :src="eduImg" />
        </v-col>
      </v-row>

    <hr class="primary mx-auto my-16" style="height:3px; border:none;width:80%" />
    <v-row justify="center" class="mt-16">
      
        <v-img contain max-width="50" max-height="50" width="50" height="50" :src="repairImg" />
      
      <v-col cols="6"  class="d-flex flex-column">
        <p class="about-text text-center text-xl-h5 text-subtitle-1">
          If you detected errors or malfunctions, please, bring them to our attention by sending a message to
        </p>
        <v-btn class="mx-auto mt-8" width="300" x-large rounded color="primary" href="mailto:arachnidatraits@sci.muni.cz">E-mail</v-btn>
        <p class="about-text text-center text-xl-h5 text-subtitle-1 mt-16">Suggestions for improvement of the database are also welcomed.</p>
      </v-col>
      <v-img contain max-width="50" max-height="50" width="50" height="50" :src="repairImg" />
    </v-row>
  </v-container>
</template>
<script>
import spider2Img from '../assets/about-1.jpg'
import spider3Img from '../assets/about-2.jpg'
import spider4Img from '../assets/about-3.jpg'
import eduImg from '../assets/edu.png'
import repairImg from '../assets/repair.png'

export default {
  name: 'AboutPage',
  data() {
    return {
      spider2Img,
      spider3Img,
      spider4Img,
      eduImg,
      repairImg
    }
  }
}
</script>
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