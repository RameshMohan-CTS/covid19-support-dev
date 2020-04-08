<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12">
          <b-breadcrumb :items="breadcrumbs" />
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-sm-12 px-4">
          <h4 class="text-primary">Thank you</h4>
          <p class="my-4">
            Thank you for the registration.You can start volunteering once our
            moderators validated your request. You will get notified via email
            once your application is verified.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      breadcrumbs: [
        { text: "Home", to: "/" },
        { text: "Volunteer registration confirmation", active: true },
      ],
    };
  },
};
</script>

<style></style>
