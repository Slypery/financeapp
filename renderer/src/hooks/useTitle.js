import useMeta from "./useMeta";

function useTitle() {
  const appName = useMeta((s) => s.meta.app_name) ?? 'My Finance App';
  let currency = useMeta((s) => s.meta.currency);
  currency = currency ? '(' + currency + ') ' : '';
  return function setTitle(title) {
    document.title = currency + appName + ' - ' + title;
  };
}

export default useTitle;