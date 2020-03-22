<template lang="pug">
  .flex.flex-col.h-full.w-full.items-center.justify-center
    base-card.max-w-sm.my-56
      .px-6.py-4#user-confirmation-card
        p.text-lg.leading-normal.text-gray-600.text-center(
          v-if="tokenValid === null"
        )
          | Checking token validity
          br
          i.el-icon-loading
        p.leading-normal.text-gray-600.text-center(v-else)
          | {{ this.validationError }}
</template>

<script>
  import { mapGetters, mapMutations } from 'vuex';

  import { plain } from '@/modules/axios';

  export default {
    props: {
      confirmationToken: {
        type: String,
        required: true,
      },
    },
    data() {
      return {
        tokenValid: null,
        validationError: '',
      };
    },
    computed: {
      ...mapGetters('user', [
        'signedIn',
      ]),
    },
    mounted() {
      this.checkTokenValidity();
    },
    methods: {
      ...mapMutations('user', [
        'setCurrentUser',
      ]),
      checkTokenValidity() {
        plain.get(`/auth/confirmations/?confirmation_token=${this.confirmationToken}`)
          .then((response) => {
            this.setCurrentUser({ user_id: response.data.user_id });
            localStorage.access = response.data.access;
            this.$router.push({ name: 'manga-list' });
          })
          .catch((request) => {
            const { error } = request.response.data;

            this.tokenValid = false;

            if (error === 'Token not found') {
              this.validationError = error;
            } else {
              this.validationError = `
                Something went wrong, try again later or contact hi@kenmei.co
              `;
            }
          });
      },
    },
  };
</script>
