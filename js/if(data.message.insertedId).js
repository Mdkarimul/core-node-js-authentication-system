if(data.message.insertedId)
{
 $(".toast").toast("show");
 $(".toast-body").html("Thank you , Signup success !");
 $(".toast-body").addClass('text-success');
}
else
{
  $(".toast").toast("show");
  $(".toast-body").html("Oops , Signup failed !");
}