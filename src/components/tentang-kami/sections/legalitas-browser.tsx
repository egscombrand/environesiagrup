'use client';

import { motion, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import { useMemo } from 'react';
import { LEGALITAS_CATEGORIES, type LegalitasCard, type LegalitasEntity } from '@/lib/legalitas-data';
import { DocumentPreviewButton } from '@/components/tentang-kami/sections/legalitas-document-modal';
import { DetailButton } from '@/components/tentang-kami/sections/legalitas-detail-modal';

// Descriptions longer than this read as more than the card's 2–3 line
// budget — they get clamped with a "Lihat Detail" modal instead of
// stretching the card to fit the longest one in the grid.
const DESCRIPTION_CLAMP_THRESHOLD = 90;

type FlatCard = { card: LegalitasCard; entityId: string; entityName: string };

function CredentialCard({ item, index }: { item: FlatCard; index: number }) {
  const { card, entityName } = item;
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay: shouldReduceMotion ? 0 : (index % 10) * 0.07, ease: [0.16, 1, 0.3, 1] }}
      className="group flex min-h-[220px] flex-col rounded-[14px] border border-[#E5E7EB] bg-white p-5 shadow-[0_1px_2px_rgba(17,17,17,0.04)] transition-[border-color,transform] duration-300 motion-reduce:transition-none motion-reduce:hover:translate-y-0 hover:-translate-y-0.5 hover:border-[#2A7793]/40 sm:min-h-[280px] sm:rounded-2xl sm:p-6"
    >
      <div className="flex-1">
        <div className="flex h-14 items-center sm:h-16">
          {card.logo ? (
            <Image
              src={card.logo}
              alt={card.logoAlt}
              width={200}
              height={64}
              className="h-full w-auto max-w-[150px] object-contain transition-transform duration-300 motion-reduce:transition-none group-hover:scale-[1.03]"
            />
          ) : null}
        </div>

        <p className="mt-[10px] font-mono text-[11px] font-bold uppercase tracking-[0.08em] text-[#2A7793] sm:text-[12px]">
          {entityName}
        </p>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-[0.06em] text-[#666666]">{card.category}</p>

        <p className="mt-2 font-landing-display text-[17px] font-bold leading-[1.3] text-[#111111] sm:text-[18px]">
          {card.title}
        </p>
        {card.subtitle ? <p className="mt-0.5 text-[13.5px] font-medium text-[#666666]">{card.subtitle}</p> : null}

        <div className="mt-2.5 border-t border-[#E5E7EB] pt-3">
          {card.intro?.length ? (
            <div className="mb-3.5 space-y-0.5">
              {card.intro.map((field) => (
                <p key={field.label} className="text-[13.5px] leading-[1.5] text-[#666666]">
                  <span className="font-semibold text-[#444444]">{field.label}:</span> {field.value}
                </p>
              ))}
            </div>
          ) : null}
          <div className="space-y-3.5">
            {card.documents.map((doc) => {
              const kategori = doc.fields.find((field) => field.label === 'Kategori');
              const nomor = doc.fields.find((field) => field.label === 'Nomor');
              const tanggal = doc.fields.find((field) => field.label === 'Tanggal');
              const rest = doc.fields.filter((field) => !['Kategori', 'Nomor', 'Tanggal'].includes(field.label));
              const combined = [nomor ? `Nomor: ${nomor.value}` : null, tanggal ? `Tanggal: ${tanggal.value}` : null]
                .filter(Boolean)
                .join(' · ');
              const isLong = (doc.description?.length ?? 0) > DESCRIPTION_CLAMP_THRESHOLD;

              return (
                <div key={doc.title}>
                  <p className="text-[15px] font-bold leading-[1.4] text-[#111111] sm:text-[16px]">{doc.title}</p>
                  {doc.description ? (
                    <p className={`mt-1.5 text-[13.5px] leading-[1.5] text-[#444444] ${isLong ? 'line-clamp-3' : ''}`}>
                      {doc.description}
                    </p>
                  ) : null}
                  {isLong ? <DetailButton document={doc} entityName={entityName} category={card.category} /> : null}
                  {kategori ? (
                    <span className="mt-1.5 inline-block rounded-full bg-[#2A7793]/10 px-2.5 py-0.5 text-[12px] font-semibold uppercase tracking-[0.04em] text-[#2A7793]">
                      {kategori.value}
                    </span>
                  ) : null}
                  <div className="mt-2.5 space-y-0.5">
                    {combined ? <p className="text-[13.5px] leading-[1.5] text-[#666666]">{combined}</p> : null}
                    {rest.map((field) => (
                      <p key={field.label} className="text-[13.5px] leading-[1.5] text-[#666666]">
                        {field.label}: {field.value}
                      </p>
                    ))}
                    {doc.issuer ? <p className="text-[13.5px] leading-[1.5] text-[#666666]">Penerbit: {doc.issuer}</p> : null}
                  </div>
                  <DocumentPreviewButton document={doc} entityName={entityName} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function LegalitasBrowser({ entities }: { entities: LegalitasEntity[] }) {
  const entitiesWithCards = useMemo(() => entities.filter((entity) => entity.cards.length > 0), [entities]);

  const allCards = useMemo<FlatCard[]>(() => {
    const categoryIndex = new Map(LEGALITAS_CATEGORIES.map((category, index) => [category, index]));
    return entitiesWithCards
      .flatMap((entity) => entity.cards.map((card) => ({ card, entityId: entity.id, entityName: entity.name })))
      .sort((a, b) => (categoryIndex.get(a.card.category) ?? 0) - (categoryIndex.get(b.card.category) ?? 0));
  }, [entitiesWithCards]);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
      {allCards.map((item, index) => (
        <CredentialCard key={item.card.id} item={item} index={index} />
      ))}
    </div>
  );
}
