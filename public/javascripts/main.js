/**
 * Created by feixiao on 16-4-3.
 */
$('#btn-change-value').click(function () {
  var str = $('#redis-value').val();
  console.log(str);
  $.post('/redis', {data: str});
});