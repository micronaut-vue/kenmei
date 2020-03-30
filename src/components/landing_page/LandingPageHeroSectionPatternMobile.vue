<template lang="html">
  <svg
    class="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-8 scale-75 origin-top sm_scale-100 lg_hidden"
    width="640"
    height="784"
    fill="none"
    viewBox="0 0 640 784"
  >
    <defs>
      <pattern
        id="svg-pattern-squares-mobile"
        x="118"
        y="0"
        width="20"
        height="20"
        patternUnits="userSpaceOnUse"
      >
        <rect
          x="0"
          y="0"
          width="4"
          height="4"
          class="text-gray-200"
          fill="currentColor"
        />
      </pattern>
    </defs>
    <rect
      y="72"
      width="640"
      height="640"
      class="text-gray-50"
      fill="currentColor"
    />
    <rect
      x="118"
      width="404"
      height="784"
      fill="url(#svg-pattern-squares-mobile)"
    />
  </svg>
</template>

<style lang="scss" scoped>
  @tailwind base;
</style>
