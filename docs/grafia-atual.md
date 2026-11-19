# Atualização de grafia: Almeida 1911 → português atual

Arquivo analisado: `PorAlmeida1911.json`. Só ortografia; o sentido do texto não muda.
Os números são ocorrências aproximadas no arquivo (sem diferenciar maiúsculas). Levantamento por padrões de palavras, não por leitura verso a verso.

Legenda de risco: **Seguro** = troca mecânica sem ambiguidade. **Revisar** = pode haver exceção ou escolha editorial.

## 1. Apóstrofo nas contrações — Seguro

| Antiga | Atual | Ocorrências |
|---|---|---|
| n'elle / n'ella / n'elles / n'ellas | nele / nela / neles / nelas | 310 / 246 / 91 / 60 |
| n'aquelle / n'aquella / n'aquelles | naquele / naquela / naqueles | 227 / 56 / 52 |
| n'este / n'esta / n'estes / n'estas | neste / nesta / nestes / nestas | 125 / 78 / 8 / 5 |
| n'isto / n'isso / n'aquillo | nisto / nisso / naquilo | 33 / 15 / 13 |
| n'esse | nesse | 4 |
| n'um / n'uma | num / numa | — |
| d'elle / d'elles | dele / deles | 687 / 752 |
| d'este, d'aqui | deste, daqui | 171 / 43 |
| d'aquelle, d'aquella | daquele, daquela | — |
| temeram-n'o | temeram-no | — |

Nota: as formas com maiúscula (`N'aquelle` 71, `N'aquelles` 19, `N'este` 7, `N'aquella` 4, `N'um` 4, `N'uma` 5, `N'elles` 3, `N'esta` 3, `N'ella` 2, `N'elle` 2, `N'esse` 1) seguem a mesma regra, preservando a maiúscula.
O commit `84fdf57` já corrigiu `N'isto` e `N'isso`.

Atenção: `d'` antes de nome próprio (`d'Israel`, `d'Ephraim`) vira `de Israel`, `de Efraim` (ver seção 3 para o nome).

## 2. Consoantes dobradas — Seguro

| Antiga | Atual |
|---|---|
| elle, ella, elles, fallou, aquelle | ele, ela, eles, falou, aquele |
| bocca, peccado, succedeu, vaccas, occidente | boca, pecado, sucedeu, vacas, ocidente (`occidente` vira `ocidente`, com um só `c`) |
| offerta, offerecer, afflicção | oferta, oferecer, aflição |
| appareceu, apparencia, opprobrio, oppressão, supplica | apareceu, aparência, opróbrio, opressão, súplica |
| immundo, immundicia, summo | imundo, imundície, sumo |
| anno, annos, canna, annunciar, innocente | ano, anos, cana, anunciar, inocente |
| metteu, permittiu, attenta, attende | meteu, permitiu, atenta, atende |
| aggravou | agravou |

## 3. Letras etimológicas — Revisar (nomes próprios)

| Antiga | Atual | Exemplos |
|---|---|---|
| ph → f | profeta, faraó, filisteus | propheta, Pharaó, philisteos |
| th → t | trono, tesouro | throno, thesouro |
| y → i | Egito, Síria, abismo, sinagoga | Egypto, Syria, abysmo, synagoga |
| ch → c/qu | sepulcro, Cristo, Páscoa | sepulchro, Christo, paschoa |
| k | (nomes) | Zedekias, Zadok |

Nomes próprios (Moysés → Moisés, Thiago → Tiago, Jonathan → Jônatas, Isaias → Isaías, Ephraim → Efraim, Josaphat → Josafá, Ammon → Amom) exigem uma convenção escolhida por você (Almeida atualizada, ou a grafia dos nomes de uma edição moderna).

## 4. Grupos consonantais — Seguro

| Antiga | Atual |
|---|---|
| sancto, sanctos, sanctuario, sanctidade | santo, santos, santuário, santidade |
| fructo, recto | fruto, reto |
| escripto, captiveiro | escrito, cativeiro |
| sciencia | ciência |

## 5. Acentuação — Seguro

| Antiga | Atual |
|---|---|
| á, ás, áquelle, áquelles, áquella | à, às, àquele, àqueles, àquela (crase) |
| fôr, fôra, dôr, flôr, corôa, perdôa, côxo, côres | for, fora, dor, flor, coroa, perdoa, coxo, cores |
| vêr, vêde, sêde | ver, vede, sede (`sêde` aqui é o imperativo de "ser": sede) |
| tambem, ninguem, tres | também, ninguém, três |
| ha | há |
| apoz | após |
| sómente | somente |

Nota: `pôr` (verbo) mantém o acento; `pôl` (pôr + o) vira `pô-lo`.

## 6. Terminações — Seguro

| Antiga | Atual |
|---|---|
| pae, paes, vae, sae, dae, tomae, fallae | pai, pais, vai, sai, dai, tomai, falai (imperativo e substantivo em `-ai`) |
| quaes, animaes | quais, animais |
| veiu | veio |
| judeos, hebreos, philisteos, cananeos, phariseos | judeus, hebreus, filisteus, cananeus, fariseus |
| egypcios | egípcios |
| -hemos (dar-vos-hemos) | -emos (dar-vos-emos) |

## 7. Prefixo "com-" — Seguro

| Antiga | Atual |
|---|---|
| comnosco, comvosco | conosco, convosco |
| commigo, comtigo | comigo, contigo |
| comtudo | contudo |
| emquanto | enquanto |

## 8. Casos isolados — Revisar

| Antiga | Atual |
|---|---|
| pozeram, poz | puseram, pôs |
| quiz, quizeram | quis, quiseram |
| creança | criança |
| aquillo | aquilo |

## Pontos de cuidado antes de aplicar

1. **Substituição por palavra inteira.** Use limites de palavra (`\b`): `ha` não pode pegar `hav-`, `poz` não pode pegar `pozeram` com a regra errada, `tres` não pode pegar `tresloucado`.
2. **Preservar maiúsculas** (`N'aquelle` → `Naquele`).
3. **Fidelidade.** Depois da troca o texto deixa de ser fiel à edição de 1911. Mantenha uma cópia do original no repositório (o histórico do git cobre isso).
4. **Busca.** A busca por "nele", "naquele" ou "também" só passa a funcionar depois da atualização.
