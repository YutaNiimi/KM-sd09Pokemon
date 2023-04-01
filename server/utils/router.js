import { Router } from "express";
import { deleteTrainer, findTrainer, findTrainers, upsertTrainer } from "~/server/utils/trainer";
import { findPokemon } from "~/server/utils/pokemon";

const router = Router();

router.get("/hello", (_req, res) => {
  res.send("Hello World!!!!!!!!!!");
});

/** トレーナー名の一覧の取得 */
router.get("/trainers", async (_req, res, next) => {
  try {
    const trainers = await findTrainers();
    // TODO: 期待するレスポンスボディに変更する
    const result = trainers.map(trainer => {
      const [name] =trainer.Key.split(".")
      return name
    });

    res.send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの追加 */
router.post("/trainer", async (req, res, next) => {
  try {
    // TODO: リクエストボディにトレーナー名が含まれていなければ400を返す

    // TODO: すでにトレーナー（S3 オブジェクト）が存在していれば409を返す
    
    
    const result = await upsertTrainer(req.body.name, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** トレーナーの取得 */
export const findTrainer = async (name) => {
  const object = await s3Client.send(
    new GetObjectCommand({
      Bucket: config.bucketName,
      Key: `${name}.json`,
    })
  );
  const trainer = JSON.parse(await streamToString(object.Body));
  return trainer;
};

/** トレーナーの更新 */
router.post("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    // TODO: トレーナーが存在していなければ404を返す
    const result = await upsertTrainer(trainerName, req.body);
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});


/** トレーナーの削除 */
// TODO: トレーナーを削除する API エンドポイントの実装
router.delete("/trainer/:trainerName", async (req, res, next) => {
  try {
    const { trainerName } = req.params;
    const result = await deleteTrainer(trainerName);
     // TODO: トレーナーが存在していなければ404を返す
    res.status(result["$metadata"].httpStatusCode).send(result);
  } catch (err) {
    next(err);
  }
});

/** ポケモンの追加 */
/** ポケモンの追加 */
router.put(
  "/trainer/:trainerName/pokemon/:pokemonName",
  async (req, res, next) => {
    try {
      const { trainerName, pokemonName } = req.params;
      const trainer = await findTrainer(trainerName);
      const pokemon = await findPokemon(pokemonName);
      const {
        order,
        name,
        sprites: { front_default },
      } = pokemon;
      trainer.pokemons.push({
        id: (trainer.pokemons[trainer.pokemons.length - 1]?.id ?? 0) + 1,
        nickname: "",
        order,
        name,
        sprites: { front_default },
      });
      const result = await upsertTrainer(trainerName, trainer);
      res.status(result["$metadata"].httpStatusCode).send(result);
    } catch (err) {
      next(err);
    }
  }
);

/** ポケモンの削除 */
// TODO: ポケモンを削除する API エンドポイントの実装

export default router;
