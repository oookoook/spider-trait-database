<template>
  <div>
    <h2>Home</h2>
    <p>{{ user == null ? 'No data' : user.username }}</p>
    <v-btn @click="checkUser">Re-check user</v-btn>
  </div>
</template>

<script>
export default {
  name: "home",
  components: {},
  data() {
    return {
      user: null
    }
  },
  methods: {
    checkUser() {
      this.$http.get("/user/info").then(
        response => {
          // get body data
          this.user = response.body;
        },
        response => {
          this.user = { username: "Please log in" };
        }
      );
    }
  },
  created() {
    this.checkUser();
  }
};
</script>
