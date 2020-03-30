<template lang="pug">
  transition(leave-active-class='duration-300')
    .modal(v-show="visible")
      transition(
        enter-active-class='ease-out duration-200'
        enter-class='opacity-0'
        enter-to-class='opacity-100'
        leave-active-class='ease-in duration-200'
        leave-class='opacity-100'
        leave-to-class='opacity-0'
      )
        .fixed.inset-0.transition-opacity(ref="modalMask" v-show="visible")
          .absolute.inset-0.bg-gray-500.opacity-75
      transition(
        enter-active-class='ease-out duration-300'
        enter-class='opacity-0 translate-y-4 sm_translate-y-0 sm_scale-95'
        enter-to-class='opacity-100 translate-y-0 sm_scale-100'
        leave-active-class='ease-in duration-200'
        leave-class='opacity-100 translate-y-0 sm_scale-100'
        leave-to-class='opacity-0 translate-y-4 sm_translate-y-0 sm_scale-95'
      )
        .modal-body(v-show="visible" v-loading="loading" :class="classes")
          .bg-white.px-4.pt-5.pb-4.sm_p-6.sm_pb-4
            .sm_flex.sm_items-from
              slot(name="body")
          .modal-actions(v-if="$slots.actions")
            slot(name="actions")
</template>

<script>
  import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock';

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      loading: {
        type: Boolean,
        default: false,
      },
      size: {
        type: String,
        default: 'md',
      },
    },
    computed: {
      classes() {
        return {
          'sm_max-w-xs': this.size === 'xs',
          'sm_max-w-sm': this.size === 'sm',
          'sm_max-w-md': this.size === 'md',
          'sm_max-w-lg': this.size === 'lg',
        };
      },
    },
    watch: {
      visible(val) {
        if (val) {
          // reserveScrollBarGap applies padding when disabling scrollbar
          disableBodyScroll(this.$refs.modal, { reserveScrollBarGap: true });
        } else {
          // Need to wait for animation to finish, to avoid content jump due to
          // padding change
          const el = this.targetElement;
          setTimeout(() => { enableBodyScroll(el); }, 200);
        }
      },
    },
    destroyed() {
      // I need to enable body scroll, in case modal gets destroyed before the
      // prop change
      enableBodyScroll(this.targetElement);
    },
    mounted() {
      document.addEventListener('keydown', (event) => {
        event.stopPropagation();

        if (this.visible && event.keyCode === 27) {
          this.$emit('dialogClosed');
        }
      });

      this.$refs.modalMask.addEventListener('click', (event) => {
        event.stopPropagation();

        this.$emit('dialogClosed');
      });
    },
  };
</script>

<style lang="scss" scoped>
  @tailwind base;

  .modal {
    @apply fixed bottom-0 inset-x-0 px-4 pb-4 z-50;
    @screen sm {
      @apply flex items-center justify-center inset-0;
    }
  }

  .modal-body {
    @apply bg-white rounded-lg overflow-hidden shadow-xl transform;
    @apply transition-all w-full;

    @screen sm {
      @apply inline-block;
    }
  }

  .modal-actions {
    @apply bg-gray-50 px-4 py-3;

    @screen sm {
      @apply px-6 flex flex-row-reverse;
    }
  }
</style>
