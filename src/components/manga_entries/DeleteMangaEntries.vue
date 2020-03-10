<template lang="pug">
  transition(leave-active-class='duration-300')
    .modal(v-show="visible")
      transition(
        enter-active-class='ease-out duration-300'
        enter-class='opacity-0'
        enter-to-class='opacity-100'
        leave-active-class='ease-in duration-200'
        leave-class='opacity-100'
        leave-to-class='opacity-0'
      )
        .fixed.inset-0.transition-opacity(ref="deleteModalMask" v-show="visible")
          .absolute.inset-0.bg-gray-500.opacity-75
      transition(
        enter-active-class='ease-out duration-300'
        enter-class='opacity-0 translate-y-4 sm_translate-y-0 sm_scale-95'
        enter-to-class='opacity-100 translate-y-0 sm_scale-100'
        leave-active-class='ease-in duration-200'
        leave-class='opacity-100 translate-y-0 sm_scale-100'
        leave-to-class='opacity-0 translate-y-4 sm_translate-y-0 sm_scale-95'
      )
        .bg-white.rounded-lg.overflow-hidden.shadow-xl.transform.transition-all.sm_max-w-lg.sm_w-full(
          v-show="visible"
        )
          .bg-white.px-4.pt-5.pb-4.sm_p-6.sm_pb-4
            .sm_flex.sm_items-from
              .mx-auto.flex-shrink-0.flex.items-center.justify-center.h-12.w-12.rounded-full.bg-red-100.sm_mx-0.sm_h-10.sm_w-10
                svg.h-6.w-6.text-red-600(
                  stroke='currentColor'
                  fill='none'
                  viewbox='0 0 24 24'
                )
                  path(
                    stroke-linecap='round'
                    stroke-linejoin='round'
                    stroke-width='2'
                    d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
                  )
              .mt-3.text-center.sm_mt-0.sm_ml-4.sm_text-left
                h3.text-lg.leading-6.font-medium.text-gray-900
                  | Multiple sites tracked
                .mt-2
                  p.text-sm.leading-5.text-gray-500
                    | Some entries have multiple sites being tracked.
                    | If you want to delete them all, please proceed. Otherwise,
                    | use the edit button to switch to a different source.
          .bg-gray-50.px-4.py-3.sm_px-6.sm_flex.sm_flex-row-reverse
            span.flex.w-full.rounded-md.shadow-sm.sm_ml-3.sm_w-auto
              base-button(type="danger" @click="$emit('confirmDeletion')")
                | Delete
            span.mt-3.flex.w-full.rounded-md.shadow-sm.sm_mt-0.sm_w-auto
              base-button(type="secondary" @click="$emit('dialogClosed')")
                | Cancel
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
    },
    mounted() {
      this.$refs.deleteModalMask.addEventListener('click', (event) => {
        event.stopPropagation();

        this.$emit('dialogClosed');
      });
    },
  };
</script>

<style lang="scss" media="screen" scoped>
  @tailwind base;

  .modal {
    @apply fixed bottom-0 inset-x-0 px-4 pb-4 z-50;
    @screen sm {
      @apply flex items-center justify-center inset-0;
    }
  }
</style>
