import { Router } from "express";
import { db, cartItemsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const cartRouter = Router();

cartRouter.get("/cart", async (req, res) => {
  try {
    const { sessionId } = req.query;
    if (!sessionId || typeof sessionId !== "string") {
      res.status(400).json({ error: "sessionId is required" });
      return;
    }
    const items = await db
      .select()
      .from(cartItemsTable)
      .where(eq(cartItemsTable.sessionId, sessionId))
      .orderBy(cartItemsTable.createdAt);
    res.json(items);
  } catch (error) {
    req.log.error(error, "Failed to fetch cart");
    res.status(500).json({ error: "Failed to fetch cart" });
  }
});

cartRouter.post("/cart", async (req, res) => {
  try {
    const { sessionId, productId, productName, productImage, price, quantity } = req.body;
    if (!sessionId || !productId || !productName || !productImage || !price) {
      res.status(400).json({ error: "Missing required fields" });
      return;
    }

    const existing = await db
      .select()
      .from(cartItemsTable)
      .where(and(eq(cartItemsTable.sessionId, sessionId), eq(cartItemsTable.productId, productId)))
      .limit(1);

    if (existing.length > 0) {
      const updated = await db
        .update(cartItemsTable)
        .set({ quantity: existing[0].quantity + (quantity ?? 1) })
        .where(eq(cartItemsTable.id, existing[0].id))
        .returning();
      res.status(201).json(updated[0]);
      return;
    }

    const inserted = await db
      .insert(cartItemsTable)
      .values({ sessionId, productId, productName, productImage, price, quantity: quantity ?? 1 })
      .returning();
    res.status(201).json(inserted[0]);
  } catch (error) {
    req.log.error(error, "Failed to add to cart");
    res.status(500).json({ error: "Failed to add to cart" });
  }
});

cartRouter.delete("/cart/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    await db.delete(cartItemsTable).where(eq(cartItemsTable.id, id));
    res.json({ success: true });
  } catch (error) {
    req.log.error(error, "Failed to remove from cart");
    res.status(500).json({ error: "Failed to remove from cart" });
  }
});

cartRouter.patch("/cart/:id/quantity", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
      res.status(400).json({ error: "quantity must be >= 1" });
      return;
    }
    const updated = await db
      .update(cartItemsTable)
      .set({ quantity })
      .where(eq(cartItemsTable.id, id))
      .returning();
    res.json(updated[0]);
  } catch (error) {
    req.log.error(error, "Failed to update cart quantity");
    res.status(500).json({ error: "Failed to update cart quantity" });
  }
});

export default cartRouter;
