export default defineNuxtPlugin(async () => {
  const pagesStore = usePagesStore()
  
  // Load pages and sections before render
  // This runs on both server and client
  try {
    await pagesStore.loadAll()
  } catch (error) {
    console.error('Failed to load pages in plugin:', error)
    // Don't throw - let the app continue with empty pages
  }
})

