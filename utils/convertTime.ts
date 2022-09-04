export const covertDuration = (milliseconds: number) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.round((milliseconds % 60000) / 1000).toFixed(0);

  return minutes + ':' + (Number(seconds) < 10 ? '0' : '') + seconds
}