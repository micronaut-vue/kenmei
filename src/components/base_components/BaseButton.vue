<template lang="pug">
  button.btn(
    type='button'
    :class='classes'
    :disabled='disabled'
    @click="$emit('click')"
  )
    slot
</template>

<script>
  export default {
    props: {
      type: {
        type: String,
        default: 'primary',
      },
      disabled: {
        type: Boolean,
        default: false,
      },
    },
    computed: {
      classes() {
        return {
          'btn-primary': this.type === 'primary',
          'btn-success': this.type === 'success',
          'btn-secondary': this.type === 'secondary',
          'btn-info': this.type === 'info',
          'btn-warn': this.type === 'warning',
          'btn-danger': this.type === 'danger',
          disabled: this.disabled,
        };
      },
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  .btn {
    @apply inline-flex justify-center w-full rounded-md border px-4 py-2;
    @apply items-center text-base leading-6 font-medium shadow-sm;
    @apply transition ease-in-out duration-150;

    &:focus {
      @apply outline-none;
    }

    @screen sm {
      @apply text-sm leading-5;
    }
  }

  .btn-secondary {
    @apply border-gray-300 bg-white text-gray-700;

    &:hover {
      @apply text-gray-500;
    }

    &:focus {
      @apply border-blue-300 shadow-outline;
    }
  }

  .btn-primary {
    @apply border-transparent bg-blue-600 text-white;

    &:hover {
      @apply bg-blue-500;
    }

    &:focus {
      @apply border-blue-700 shadow-outline;
    }
  }

  .btn-success {
    @apply border-transparent bg-el-green text-white;

    &:hover {
      @apply bg-el-green-light;
    }

    &:focus {
      @apply border-green-500 shadow-outline;
    }
  }

  .btn-info {
    @apply border-transparent bg-gray-500 text-white;

    &:hover {
      @apply bg-gray-400;
    }

    &:focus {
      @apply border-gray-600 shadow-outline-red;
    }
  }

  .btn-warn {
    @apply border-transparent bg-yellow-400 text-white;

    &:hover {
      @apply bg-yellow-300;
    }

    &:focus {
      @apply border-yellow-500 shadow-outline-red;
    }
  }

  .btn-danger {
    @apply border-transparent bg-red-600 text-white;

    &:hover {
      @apply bg-red-500;
    }

    &:focus {
      @apply border-red-700 shadow-outline-red;
    }
  }

  .disabled {
    @apply opacity-50 cursor-not-allowed;
  }
</style>
