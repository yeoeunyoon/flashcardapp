import useQueryDecks from "@/hooks/use-query-decks";

const Header = () => {
  const { meta } = useQueryDecks();
  return (
    <div className="flex items-center justify-between p-4 border-b">
      <h1 className=""></h1>

      <p className="text-sm font-semibold">
        {meta.page * meta.limit - (meta.limit - 1)}-
        {Math.min(meta.page * meta.limit, meta.totalCount)} of {meta.totalCount} decks
      </p>
    </div>
  );
};

export default Header;
