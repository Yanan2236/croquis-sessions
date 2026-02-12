export type IntervalSec = 20 | 30 | 60 | 120 | 180 | 300;

export type PickedFileEntry = {
  name: string;
  handle: FileSystemFileHandle;
};

export type RunSessionContext = {
  dirName: string | null;
  intervalSec: IntervalSec;
  entries?: PickedFileEntry[];
};

/**
 * Sessionの一時コンテキストを保存するストア
 * リロード / タブ閉じ で消える
 * Session中のみメモリを保持する前提
 */
const runSessionContextMap = new Map<number, RunSessionContext>();

/**
 * 指定したSessionのRunContextを登録（上書き）する
 * @param sessionId 更新対象のSession ID
 * @param context   更新内容
 * 
 * @remarks
 * - 開始画面で dirHandle と intervalSec を確定 → set → Run画面へ遷移 の流れを想定
 */

export const setRunContext = (sessionId: number, context: RunSessionContext) => {
  runSessionContextMap.set(sessionId, context);
};

/**
 * 指定したSessionのRunContextを取得する
 * @param sessionId 取得対象のSession ID
 * @returns 
 * - RunSessionContext : 存在する場合
 * - null : 未登録 / リロードなどで消えた場合
 */
export const getRunContext = (sessionId: number) => {
  return runSessionContextMap.get(sessionId) ?? null;
};

/**
 * 指定したSessionのRunContextを部分更新する
 * @param sessionId 更新対象のSession ID
 * @param patch     更新内容
 * @returns 
 * - true : 更新成功
 * - false : 指定したsessionIdのRunContextが存在しない場合
 */
export const patchRunContext = (
  sessionId: number,
  patch: Partial<RunSessionContext>
) => {
  const old = runSessionContextMap.get(sessionId);
  if (!old) return false;
  runSessionContextMap.set(sessionId, { ...old, ...patch });
  return true;
};

/**
 * 指定したSessionのRunContextを削除する
 * @param sessionId 削除対象のSession ID
 * 
 * @remarks
 * - Session終了時に呼び出すことを想定
 */
export const deleteRunContext = (sessionId: number) => {
  runSessionContextMap.delete(sessionId);
};