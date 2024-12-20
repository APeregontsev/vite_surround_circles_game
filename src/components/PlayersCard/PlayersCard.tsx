import { PropsWithChildren } from "react";
import { useForm } from "react-hook-form";
import { RouteTypes, TGameType, useSettings, useStore } from "src/store/store";
import { Button } from "src/ui";
import { Input, MenuCard } from "..";
import "./styles.scss";

type Props = {};
type TFormData = { player_1: ""; player_2: "" };

export const PlayersCard = ({}: PropsWithChildren<Props>) => {
  const { navigate, setPlayerA, setPlayerB } = useSettings((state) => ({
    navigate: state.navigate,
    setPlayerA: state.setPlayerA,
    setPlayerB: state.setPlayerB,
  }));

  const { is_vs_pc } = useStore((state) => ({
    is_vs_pc: state.gameType === TGameType.P_vs_C,
  }));

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TFormData>({
    mode: "onChange",
  });

  function navigateMainMenu() {
    navigate(RouteTypes.M_MENU);
  }

  function onSubmit(formData: TFormData) {
    setPlayerA(formData.player_1);
    setPlayerB(formData.player_2);

    navigate(RouteTypes.GAME);
  }

  const title = is_vs_pc ? "Player " : "Players";
  const subTitle = is_vs_pc ? "Enter your name" : "Provide players names";
  const inputLabel = is_vs_pc ? undefined : "Player 1";
  const inputPlaceholder = is_vs_pc ? "Enter your name here" : "Enter players name here";

  return (
    <MenuCard>
      <form className="form-wrapper" onSubmit={handleSubmit(onSubmit)}>
        <div className="title-wrapper">
          <h1>
            {title}
            {is_vs_pc && <span className="title-vs-ai"> vs AI</span>}
          </h1>
          <div className="subtitle">{subTitle}</div>
        </div>

        <div className="body-inner-wrapper">
          <Input
            placeholder={inputPlaceholder}
            id="player_1"
            type="text"
            label={inputLabel}
            color="blue"
            {...register("player_1", {
              required: "Can’t be empty!",
            })}
            errorMessage={errors?.player_1?.message}
          />
          {!is_vs_pc && (
            <Input
              placeholder="Enter players name here"
              id="player_2"
              type="text"
              label="Player 2"
              color="red"
              {...register("player_2", {
                required: "Can’t be empty!",
              })}
              errorMessage={errors?.player_2?.message}
            />
          )}
        </div>
        <div className="btn-wrapper">
          <Button outlined fullwidth onClick={navigateMainMenu} type="reset">
            Back
          </Button>

          <Button fullwidth type="submit">
            Start game
          </Button>
        </div>
      </form>
    </MenuCard>
  );
};
