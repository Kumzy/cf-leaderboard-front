<template>
  <v-app id="App">
    <v-main>
      <v-container style="display: flex; align-items: center; justify-content: center; position: relative; height: 100vh;">
        <v-card class="elevation-3" style="z-index: 1;padding: 40px;width: 100%;max-width: 400px;position: relative;">

          <v-card-title>
            <v-container justify-center>
              <v-layout row justify-center>
                <v-img style="margin-bottom: 16px; max-width: 200px;" contain :src="require('@/assets/logo.png')" />
              </v-layout>
              <v-layout row justify-center>
                <div style="text-align: center; margin-bottom: 10px;">Crossfit Clapiers</div>
              </v-layout>
            </v-container>
          </v-card-title>

          <v-card-subtitle>
            <v-layout row justify-center>
              Please authenticate yourself
            </v-layout>
          </v-card-subtitle>

          <p></p>

          <v-form ref="loginForm" v-model="valid">
            <v-text-field
              ref="email"
              v-model="loginForm.email"
              :rules="emailRules"
              required
              outlined
              dense
              name="email"
              placeholder="Email"
              type="text"
              autocomplete="on"
              label="E-mail"
            />

            <v-text-field
              ref="password"
              v-model="loginForm.password"
              :append-icon="showPwd ? icons.eye : icons.eyeOff"
              :rules="passwordRules"
              :type="showPwd ? 'text' : 'password'"
              name="password"
              outlined
              dense
              label="Password"
              placeholder="Password"
              @click:append="showPwd = !showPwd"
              @keyup.enter.native="handleLogin"
            />
          </v-form>

          <v-card-actions>
            <v-container justify-center>
              <v-layout row justify-center>
                <v-btn class="text-none" block tile :loading="loading" color="primary" style="margin-bottom: 10px;" @click.native.prevent="handleLogin">Login</v-btn>
              </v-layout>
            </v-container>
          </v-card-actions>

        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script>
import { validEmail } from '@/utils/validate'
import { mdiEyeOff, mdiEye  } from '@mdi/js'; 
// import { getToken } from '@/utils/auth'

export default {
  name: 'Login',
  data() {
    return {
      valid: false,
      icons: {
        eye: mdiEye,
        eyeOff: mdiEyeOff
      },
      showPwd: false, // Eye to show password or not
      email: '',
      password: '',
      remember: '',
      loginForm: {
        email: '',
        password: '',
        remember: false
      },
      emailRules: [
        value => !!value || 'Email is required',
        value => validEmail(value) || 'Invalid email format'
      ],
      passwordRules: [
        value => !!value || 'Password is required'
      ],
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    // if (this.loginForm.email === '') {
    //   this.$refs.email.focus()
    // } else if (this.loginForm.password === '') {
    //   this.$refs.password.focus()
    // }
  },
  methods: {
    handleLogin() {
      if (this.$refs.loginForm.validate()) {
        this.loading = true
        this.$store.dispatch('user/login', this.loginForm)
          .then(() => {
            // this.$cookie.set('token',res.data.token)
            this.$router.push({ path: this.redirect || '/', query: this.otherQuery })
            this.loading = false
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">  
  .v-btn__content {
    font-weight: normal;
    letter-spacing: normal;
  }
</style>