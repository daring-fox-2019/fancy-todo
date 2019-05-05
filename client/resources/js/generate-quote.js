function generateQuote() {
  $.ajax({
    method: "GET",
    url: "http://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1",
    cache: false,
    headers: {
      "Accept": "application/json"
    },
  })
    .done(response => {
      console.log(response);
      const quote = response[0].content;
      const author = response[0].title;

      $("#random-quote").html(`${quote}`);
      $("#random-quote-author").text(`- ${author}`);
    })
    .fail((jqXHR, textStatus) => {
      console.log(textStatus);
    });
}