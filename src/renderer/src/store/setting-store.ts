import { getStore, setStore } from './store'

export const NAMESPACE_SETTING = 'setting'

export const setGsiConfigFilePathStore = async (path: string) => {
  await setStore(`${NAMESPACE_SETTING}.gsiPath`, path)
}

export const getGsiConfigFilePathStore = async () => {
  return await getStore(`${NAMESPACE_SETTING}.gsiPath`)
}
